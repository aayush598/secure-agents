import { describe, it, expect } from 'vitest';
import { HallucinationRiskGuardrail } from '@/modules/guardrails/guards/output/hallucination-risk.guardrail';

describe('HallucinationRiskGuardrail', () => {
  it('allows factual content with citation', () => {
    const g = new HallucinationRiskGuardrail({ requireCitations: true });

    const res = g.execute('According to research [1], the Earth orbits the Sun.', {});

    expect(res.action).toBe('ALLOW');
    expect(res.passed).toBe(true);
  });

  it('warns on unverifiable research claim', () => {
    const g = new HallucinationRiskGuardrail();

    const res = g.execute('Studies show that drinking water increases intelligence.', {});

    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('blocks high-risk hallucinated output', () => {
    const g = new HallucinationRiskGuardrail({
      blockThreshold: 0.5,
    });

    const res = g.execute('Experts say this was proven in 1997 and is definitely guaranteed.', {});

    expect(res.action).toBe('BLOCK');
    expect(res.passed).toBe(false);
  });

  it('returns metadata with score and signals', () => {
    const g = new HallucinationRiskGuardrail();

    const res = g.execute('Research indicates this always works.', {});

    expect(res.metadata).toBeDefined();
    expect(res.metadata?.signals.length).toBeGreaterThan(0);
    expect(typeof res.metadata?.score).toBe('number');
  });
});
