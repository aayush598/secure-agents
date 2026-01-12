import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailResult } from '../core/types';

/* ============================================================================
 * CONFIG
 * ========================================================================== */

export interface ApiRateLimitConfig {
  /** Max requests allowed in the window */
  maxRequests: number;

  /** Window size in milliseconds */
  windowMs: number;

  /** Identifier strategy */
  keyBy?: 'apiKeyId' | 'userId' | 'profileId' | 'ip';

  /** Whether to block or warn when limit exceeded */
  mode?: 'BLOCK' | 'WARN';
}

/* ============================================================================
 * INTERNAL STATE (in-memory)
 * ========================================================================== */

type Bucket = {
  count: number;
  windowStart: number;
};

const buckets = new Map<string, Bucket>();

/* ============================================================================
 * GUARDRAIL
 * ========================================================================== */

export class ApiRateLimitGuardrail extends BaseGuardrail<ApiRateLimitConfig> {
  constructor(config: ApiRateLimitConfig) {
    super('ApiRateLimit', 'tool', config);

    if (!config?.maxRequests || !config?.windowMs) {
      throw new Error('ApiRateLimitGuardrail requires maxRequests and windowMs');
    }
  }

  execute(_: string, context: GuardrailContext): GuardrailResult {
    const identifier = this.resolveIdentifier(context);

    // If we cannot identify → allow (fail-open)
    if (!identifier) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No rate-limit identifier available',
      });
    }

    const now = Date.now();
    const bucket = buckets.get(identifier);

    if (!bucket || now - bucket.windowStart > this.config.windowMs) {
      buckets.set(identifier, { count: 1, windowStart: now });
      return this.allow(identifier, 1);
    }

    bucket.count++;

    if (bucket.count > this.config.maxRequests) {
      return this.limitExceeded(identifier, bucket.count);
    }

    return this.allow(identifier, bucket.count);
  }

  /* =========================================================================
   * HELPERS
   * ========================================================================= */

  private resolveIdentifier(ctx: GuardrailContext): string | null {
    const keyBy = this.config.keyBy ?? 'apiKeyId';

    switch (keyBy) {
      case 'apiKeyId':
        return ctx.apiKeyId ?? null;
      case 'userId':
        return ctx.userId ?? null;
      case 'profileId':
        return ctx.profileId ?? null;
      case 'ip':
        return (ctx as any).ip ?? null;
      default:
        return null;
    }
  }

  private allow(id: string, count: number): GuardrailResult {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: `Rate limit OK (${count}/${this.config.maxRequests})`,
      metadata: {
        identifier: id,
        remaining: Math.max(0, this.config.maxRequests - count),
        windowMs: this.config.windowMs,
      },
    });
  }

  private limitExceeded(id: string, count: number): GuardrailResult {
    const action = this.config.mode === 'WARN' ? 'WARN' : 'BLOCK';

    return this.result({
      passed: false,
      action,
      severity: 'error',
      message: `API rate limit exceeded (${count}/${this.config.maxRequests})`,
      metadata: {
        identifier: id,
        retryAfterMs: this.config.windowMs - (Date.now() - (buckets.get(id)?.windowStart ?? 0)),
      },
    });
  }
}

/* ============================================================================
 * TEST SUPPORT (OPTIONAL)
 * ========================================================================== */

/** ONLY FOR TESTS */
export function __resetRateLimitBuckets() {
  buckets.clear();
}
