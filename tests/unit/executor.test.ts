// tests/unit/executor.test.ts
import { describe, it, expect } from 'vitest';
import { executeGuardrails } from '@/modules/guardrails/engine/executor';
import { BaseGuardrail } from '@/modules/guardrails/engine/base.guardrails';
import type { GuardrailContext } from '@/modules/guardrails/engine/context';

class AllowGuardrail extends BaseGuardrail {
  constructor() {
    super('AllowGuardrail', 'input', {});
  }

  execute() {
    return this.result({
      passed: true,
      action: 'ALLOW',
      severity: 'info',
    });
  }
}

class BlockGuardrail extends BaseGuardrail {
  constructor() {
    super('BlockGuardrail', 'input', {});
  }

  execute() {
    return this.result({
      passed: false,
      action: 'BLOCK',
      severity: 'error',
      message: 'Blocked intentionally',
    });
  }
}

class ThrowingGuardrail extends BaseGuardrail {
  constructor() {
    super('ThrowingGuardrail', 'input', {});
  }

  execute(_text: string, _context: GuardrailContext): never {
    throw new Error('boom');
  }
}

describe('executeGuardrails', () => {
  it('executes guardrails sequentially', async () => {
    const result = await executeGuardrails(
      [new AllowGuardrail(), new AllowGuardrail()],
      'hello',
      {} as GuardrailContext,
    );

    expect(result.results.length).toBe(2);
    expect(result.passed).toBe(true);
    expect(result.summary.passed).toBe(2);
    expect(result.summary.failed).toBe(0);
  });

  it('short-circuits on BLOCK', async () => {
    const result = await executeGuardrails(
      [new AllowGuardrail(), new BlockGuardrail(), new AllowGuardrail()],
      'hello',
      {},
    );

    expect(result.results.length).toBe(2);
    expect(result.results[1].action).toBe('BLOCK');
    expect(result.passed).toBe(false);
  });

  it('converts thrown error into BLOCK result', async () => {
    const result = await executeGuardrails(
      [new AllowGuardrail(), new ThrowingGuardrail(), new AllowGuardrail()],
      'hello',
      {},
    );

    expect(result.results.length).toBe(2);
    expect(result.results[1].action).toBe('BLOCK');
    expect(result.results[1].severity).toBe('error');
    expect(result.results[1].message).toBe('boom');
    expect(result.passed).toBe(false);
  });

  it('computes execution summary correctly', async () => {
    const result = await executeGuardrails(
      [new AllowGuardrail(), new BlockGuardrail()],
      'hello',
      {},
    );

    expect(result.summary).toEqual({
      total: 2,
      passed: 1,
      failed: 1,
    });

    expect(result.executionTimeMs).toBeGreaterThanOrEqual(0);
  });
});
