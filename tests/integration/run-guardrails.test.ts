// tests/integration/run-guardrails.test.ts
import { describe, it, expect } from 'vitest';
import { runGuardrails } from '@/modules/guardrails/service/run-guardrails';

// IMPORTANT: this side-effect import registers guardrails
import '@/modules/guardrails';

describe('runGuardrails (integration)', () => {
  it('executes registered guardrails end-to-end', async () => {
    const result = await runGuardrails(
      ['NSFWAdvanced'],
      'explicit sexual intercourse with orgasm',
      { validationType: 'input' },
    );

    expect(result.passed).toBe(false);
    expect(result.results[0].action).toBe('BLOCK');
    expect(result.summary.failed).toBe(1);
  });

  it('throws if guardrail is not registered', async () => {
    await expect(runGuardrails(['UnknownGuardrail'], 'test', {})).rejects.toThrow(/not registered/);
  });

  it('short-circuits on BLOCK', async () => {
    const result = await runGuardrails(
      ['NSFWAdvanced', 'InputSize'],
      'explicit sexual intercourse',
      {},
    );

    expect(result.results.length).toBe(1);
  });
});
