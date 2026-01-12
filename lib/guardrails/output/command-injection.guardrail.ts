import { BaseGuardrail } from '../core/base';
import { GuardrailContext } from '../core/context';
import { GuardrailAction, GuardrailSeverity } from '../core/types';

export interface CommandInjectionGuardrailConfig {
  /**
   * If true, downgrade BLOCK → WARN
   * Useful for sandboxed / review-only environments
   */
  warnOnly?: boolean;

  /**
   * Additional custom patterns
   */
  extraPatterns?: RegExp[];
}

export class CommandInjectionOutputGuardrail extends BaseGuardrail<CommandInjectionGuardrailConfig> {
  private readonly patterns: RegExp[];

  constructor(config: CommandInjectionGuardrailConfig = {}) {
    super('CommandInjectionOutput', 'output', config);

    this.patterns = [
      // Shell execution
      /\b(rm\s+-rf|sudo\s+|chmod\s+\+x)\b/i,
      /\b(curl|wget)\b.*\|\s*(sh|bash)/i,
      /\b(bash|sh|zsh|powershell|cmd\.exe)\b/i,

      // Command chaining
      /(&&|\|\||;)\s*\w+/,

      // Subshell execution
      /\$\([^)]*\)/,
      /`[^`]+`/,

      // Redirection
      />\s*\/\w+/,
      /<\s*\/\w+/,

      // SQL / system hybrid attacks
      /\b(drop\s+table|shutdown\s+-h)\b/i,

      ...(config.extraPatterns ?? []),
    ];
  }

  execute(text: string, _context: GuardrailContext) {
    if (!text || typeof text !== 'string') {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
        message: 'Empty output',
      });
    }

    const matches = this.detect(text);

    if (matches.length === 0) {
      return this.result({
        passed: true,
        action: 'ALLOW',
        severity: 'info',
      });
    }

    const action: GuardrailAction = this.config.warnOnly ? 'WARN' : 'BLOCK';

    return this.result({
      passed: action !== 'BLOCK',
      action,
      severity: action === 'BLOCK' ? 'critical' : 'warning',
      message: 'Potential command injection detected in output',
      metadata: {
        matchCount: matches.length,
        samples: matches.slice(0, 3),
      },
    });
  }

  private detect(text: string): string[] {
    const hits: string[] = [];

    for (const rx of this.patterns) {
      const match = text.match(rx);
      if (match) hits.push(match[0]);
    }

    return hits;
  }
}
