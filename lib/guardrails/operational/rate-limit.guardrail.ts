import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailResult } from '../core/types';

/* ============================================================================
 * Rate Limiter Store (In-Memory)
 * Replace with Redis / KV in production
 * ========================================================================== */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

/* ============================================================================
 * Config
 * ========================================================================== */

export interface RateLimitGuardrailConfig {
  /** Requests allowed per window */
  limit: number;

  /** Window size in milliseconds */
  windowMs: number;

  /** Emit WARN when remaining <= threshold */
  warnThreshold?: number;
}

/* ============================================================================
 * Guardrail
 * ========================================================================== */

export class RateLimitGuardrail extends BaseGuardrail<RateLimitGuardrailConfig> {
  constructor(config: RateLimitGuardrailConfig) {
    super('RateLimit', 'general', config);
  }

  execute(_: string, context: GuardrailContext): GuardrailResult {
    const key = context.apiKeyId ?? context.userId ?? 'anonymous';

    const now = Date.now();
    const entry = store.get(key);

    // New window
    if (!entry || now >= entry.resetAt) {
      store.set(key, {
        count: 1,
        resetAt: now + this.config.windowMs,
      });

      return this.allow(1, this.config.limit);
    }

    entry.count++;

    if (entry.count > this.config.limit) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: 'Rate limit exceeded',
        metadata: {
          limit: this.config.limit,
          windowMs: this.config.windowMs,
          retryAfterMs: entry.resetAt - now,
        },
      });
    }

    const remaining = this.config.limit - entry.count;

    if (this.config.warnThreshold !== undefined && remaining <= this.config.warnThreshold) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: 'Approaching rate limit',
        metadata: {
          remaining,
        },
      });
    }

    return this.allow(entry.count, this.config.limit);
  }

  private allow(count: number, limit: number): GuardrailResult {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      metadata: {
        used: count,
        remaining: Math.max(0, limit - count),
      },
    });
  }

  /* =========================================================================
   * Test utilities (NOT exported publicly)
   * ========================================================================= */

  static __clearStore() {
    store.clear();
  }
}
