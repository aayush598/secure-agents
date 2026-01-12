import { describe, it, expect } from 'vitest';
import { CostThresholdGuardrail } from '@/lib/guardrails/operational/cost-threshold.guardrail';

describe('CostThresholdGuardrail', () => {
  const baseConfig = {
    maxCostUsd: 10,
    warnCostUsd: 7,
  };

  it('allows when no usage is present', () => {
    const g = new CostThresholdGuardrail(baseConfig);
    const res = g.execute('', {});
    expect(res.action).toBe('ALLOW');
  });

  it('allows when cost is below warning threshold', () => {
    const g = new CostThresholdGuardrail(baseConfig);
    const res = g.execute('', {
      usage: { estimatedCostUsd: 3 },
    } as any);

    expect(res.action).toBe('ALLOW');
  });

  it('warns when cost exceeds warning threshold', () => {
    const g = new CostThresholdGuardrail(baseConfig);
    const res = g.execute('', {
      usage: { estimatedCostUsd: 8 },
    } as any);

    expect(res.action).toBe('WARN');
    expect(res.passed).toBe(true);
  });

  it('blocks when cost exceeds max threshold', () => {
    const g = new CostThresholdGuardrail(baseConfig);
    const res = g.execute('', {
      usage: { estimatedCostUsd: 12 },
    } as any);

    expect(res.action).toBe('BLOCK');
    expect(res.passed).toBe(false);
  });

  it('supports daily mode', () => {
    const g = new CostThresholdGuardrail({
      maxCostUsd: 100,
      mode: 'daily',
    });

    const res = g.execute('', {
      usage: { dailyCostUsd: 101 },
    } as any);

    expect(res.action).toBe('BLOCK');
  });

  it('supports monthly mode', () => {
    const g = new CostThresholdGuardrail({
      maxCostUsd: 1000,
      mode: 'monthly',
    });

    const res = g.execute('', {
      usage: { monthlyCostUsd: 999 },
    } as any);

    expect(res.action).toBe('WARN');
  });
});
