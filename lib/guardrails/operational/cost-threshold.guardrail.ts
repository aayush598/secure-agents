import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* ============================================================================
 * Config
 * ========================================================================= */

export interface CostThresholdConfig {
  /** Hard block limit (USD) */
  maxCostUsd: number;

  /** Warning threshold (USD) */
  warnCostUsd?: number;

  /** Which metric to enforce */
  mode?: 'request' | 'daily' | 'monthly';

  /** Whether to include metadata */
  includeTelemetry?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================= */

export class CostThresholdGuardrail extends BaseGuardrail<CostThresholdConfig> {
  constructor(config: CostThresholdConfig) {
    super('CostThreshold', 'general', config);

    if (config.maxCostUsd <= 0) {
      throw new Error('maxCostUsd must be > 0');
    }
  }

  execute(_: string, context: GuardrailContext) {
    const usage = (context as any)?.usage;

    if (!usage) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No usage data provided',
      });
    }

    const mode = this.config.mode ?? 'request';

    const cost =
      mode === 'daily'
        ? usage.dailyCostUsd
        : mode === 'monthly'
          ? usage.monthlyCostUsd
          : usage.estimatedCostUsd;

    if (typeof cost !== 'number') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Cost metric not available',
      });
    }

    const warnAt = this.config.warnCostUsd ?? this.config.maxCostUsd * 0.8;

    /* -------------------- BLOCK -------------------- */
    if (cost >= this.config.maxCostUsd) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: `Cost limit exceeded (${cost.toFixed(2)} USD)`,
        metadata: this.buildMetadata(cost, mode),
      });
    }

    /* -------------------- WARN -------------------- */
    if (cost >= warnAt) {
      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: `Cost nearing limit (${cost.toFixed(2)} USD)`,
        metadata: this.buildMetadata(cost, mode),
      });
    }

    /* -------------------- ALLOW -------------------- */
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: 'Cost within limits',
      metadata: this.buildMetadata(cost, mode),
    });
  }

  private buildMetadata(cost: number, mode: string) {
    if (this.config.includeTelemetry === false) return undefined;

    return {
      mode,
      costUsd: Number(cost.toFixed(4)),
      maxCostUsd: this.config.maxCostUsd,
      timestamp: new Date().toISOString(),
    };
  }
}
