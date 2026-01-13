import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import { GuardrailContext } from '@/modules/guardrails/engine/context';
import { GuardrailAction, GuardrailSeverity } from '@/modules/guardrails/engine/types';

/* ============================================================================
 * Config
 * ========================================================================== */

export interface ModelVersionPinConfig {
  /**
   * Explicitly allowed full model identifiers
   * Example: ['gpt-4.1-2024-11-20']
   */
  allowedModels: string[];

  /**
   * If true, blocks models without an explicit version suffix
   * Example: blocks "gpt-4", allows "gpt-4.1-2024-11-20"
   */
  requireExplicitVersion?: boolean;

  /**
   * If true, unknown models are blocked
   * If false, unknown models generate a WARN
   */
  strict?: boolean;
}

/* ============================================================================
 * Guardrail
 * ========================================================================== */

export class ModelVersionPinGuardrail extends BaseGuardrail<ModelVersionPinConfig> {
  constructor(config?: Partial<ModelVersionPinConfig>) {
    const resolved: ModelVersionPinConfig = {
      allowedModels: config?.allowedModels ?? [],
      requireExplicitVersion: config?.requireExplicitVersion ?? true,
      strict: config?.strict ?? true,
    };

    super('ModelVersionPin', 'general', resolved);

    if (this.config.allowedModels.length === 0) {
      throw new Error('ModelVersionPinGuardrail requires allowedModels');
    }
  }

  execute(_: string, context: GuardrailContext) {
    const model = (context as any)?.model;

    if (!model || typeof model !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'No model specified',
      });
    }

    const { allowedModels, requireExplicitVersion = true, strict = true } = this.config;

    const hasExplicitVersion = /-\d{4}-\d{2}-\d{2}$/.test(model);

    if (requireExplicitVersion && !hasExplicitVersion) {
      return this.result({
        passed: false,
        action: 'BLOCK',
        severity: 'error',
        message: `Model "${model}" is not version-pinned`,
        metadata: {
          model,
          allowedModels,
        },
      });
    }

    if (!allowedModels.includes(model)) {
      if (strict) {
        return this.result({
          passed: false,
          action: 'BLOCK',
          severity: 'error',
          message: `Model "${model}" is not in the allowed model list`,
          metadata: {
            model,
            allowedModels,
          },
        });
      }

      return this.result({
        passed: true,
        action: 'WARN',
        severity: 'warning',
        message: `Model "${model}" is not explicitly pinned but allowed by policy`,
        metadata: {
          model,
          allowedModels,
        },
      });
    }

    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message: `Model "${model}" is explicitly pinned`,
      metadata: {
        model,
      },
    });
  }
}
