// tests/unit/registry.test.ts
import { describe, it, expect } from 'vitest';
import { GuardrailRegistry } from '@/lib/guardrails/core/registry';
import { BaseGuardrail } from '@/lib/guardrails/core/base';

class Dummy extends BaseGuardrail {
  execute() {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
    });
  }
}

describe('GuardrailRegistry', () => {
  it('registers and creates guardrails', () => {
    const r = new GuardrailRegistry();
    r.register('Dummy', () => new Dummy('Dummy', 'input', {}));

    const g = r.create('Dummy');
    expect(g.name).toBe('Dummy');
  });

  it('throws on missing guardrail', () => {
    const r = new GuardrailRegistry();
    expect(() => r.create('Missing')).toThrow(/not registered/);
  });
});
