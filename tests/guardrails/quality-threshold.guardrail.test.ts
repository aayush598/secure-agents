import { describe, it, expect } from 'vitest';
import { QualityThresholdGuardrail } from '@/modules/guardrails/guards/output/quality-threshold.guardrail';

describe('QualityThresholdGuardrail', () => {
  it('allows high-quality output', () => {
    const g = new QualityThresholdGuardrail();

    const res = g.execute(
      'This is a well-formed response that provides meaningful information with sufficient detail.',
    );

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns on very short output', () => {
    const g = new QualityThresholdGuardrail();

    const res = g.execute('Too short.');

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.metadata?.violations).toContain('too_short');
  });

  it('detects high repetition', () => {
    const g = new QualityThresholdGuardrail();

    const res = g.execute('yes yes yes yes yes yes yes yes yes yes');

    expect(res.action).toBe('WARN');
    expect(res.metadata?.violations).toContain('high_repetition');
  });

  it('blocks when hardFail is enabled', () => {
    const g = new QualityThresholdGuardrail({
      hardFail: true,
    });

    const res = g.execute('ok');

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('blocks invalid output', () => {
    const g = new QualityThresholdGuardrail();

    const res = g.execute('' as any);

    expect(res.action).toBe('BLOCK');
  });
});
