// tests/unit/registry.test.ts
import { describe, it, expect } from 'vitest';
import { GuardrailRegistry } from '@/modules/guardrails/engine/registry';
import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';

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

    r.register('Dummy', (c) => new Dummy('Dummy', 'input', c));

    const g = r.create('Dummy', {}); // ✅ pass empty config
    expect(g.name).toBe('Dummy');
  });

  it('throws on missing guardrail', () => {
    const r = new GuardrailRegistry();

    expect(() => r.create('Missing', {})).toThrow(/not registered/);
  });
});
