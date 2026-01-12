import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

/* ---------------------------------------------------------------------------
 * Config
 * ------------------------------------------------------------------------- */
export interface UserConsentGuardrailConfig {
  /**
   * If true, missing consent will WARN instead of BLOCK
   * Default: false (BLOCK)
   */
  warnOnly?: boolean;

  /**
   * Allowed legal bases that bypass explicit consent
   * e.g. ['legal', 'contract']
   */
  allowedLegalBases?: string[];

  /**
   * Required consent scopes
   * e.g. ['profile', 'analytics']
   */
  requiredScopes?: string[];
}

/* ---------------------------------------------------------------------------
 * Guardrail
 * ------------------------------------------------------------------------- */
export class UserConsentValidationGuardrail extends BaseGuardrail<UserConsentGuardrailConfig> {
  constructor(config: UserConsentGuardrailConfig = {}) {
    super('UserConsentValidation', 'input', config);
  }

  execute(_text: string, context: GuardrailContext) {
    const consent = (context as any).userConsent;

    // No consent object at all → violation
    if (!consent) {
      return this.violation('User consent is missing', context);
    }

    // Explicit consent not given
    if (!consent.given) {
      // Check legal basis exception
      if (consent.source && this.config.allowedLegalBases?.includes(consent.source)) {
        return this.allow('Processing allowed under legal basis');
      }

      return this.violation('User consent not granted', context);
    }

    // Scope validation (if configured)
    if (this.config.requiredScopes?.length) {
      const scopes = consent.scope ?? [];
      const missing = this.config.requiredScopes.filter((s) => !scopes.includes(s));

      if (missing.length > 0) {
        return this.violation(`Missing required consent scopes: ${missing.join(', ')}`, context);
      }
    }

    return this.allow('User consent validated');
  }

  /* --------------------------------------------------------------------- */

  private allow(message: string) {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
      message,
    });
  }

  private violation(message: string, context: GuardrailContext) {
    const action: GuardrailAction = this.config.warnOnly ? 'WARN' : 'BLOCK';
    const severity: GuardrailSeverity = this.config.warnOnly ? 'warning' : 'error';

    return this.result({
      passed: false,
      action,
      severity,
      message,
      metadata: {
        userId: context.userId,
        purpose: (context as any).processingPurpose,
      },
    });
  }
}
