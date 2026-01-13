import { describe, it, expect } from 'vitest';
import { MedicalAdviceGuardrail } from '@/modules/guardrails/guards/content/medical-advice.guardrail';

describe('MedicalAdviceGuardrail', () => {
  it('allows general health information', () => {
    const g = new MedicalAdviceGuardrail();
    const res = g.execute('Exercise is good for health', {});
    expect(res.action).toBe('ALLOW');
  });

  it('blocks medical diagnosis', () => {
    const g = new MedicalAdviceGuardrail();
    const res = g.execute('You have diabetes', {});
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('blocks prescription dosage advice', () => {
    const g = new MedicalAdviceGuardrail();
    const res = g.execute('Take 500mg twice daily', {});
    expect(res.action).toBe('BLOCK');
  });

  it('warns on treatment advice without disclaimer', () => {
    const g = new MedicalAdviceGuardrail();
    const res = g.execute('You should take antibiotics', {});
    expect(res.action).toBe('WARN');
  });

  it('allows treatment advice with disclaimer', () => {
    const g = new MedicalAdviceGuardrail();
    const res = g.execute('You should rest, but this is not medical advice', {});
    expect(res.action).toBe('WARN');
  });

  it('blocks treatment advice in strict mode', () => {
    const g = new MedicalAdviceGuardrail({ strictMode: true });
    const res = g.execute('You should take painkillers', {});
    expect(res.action).toBe('BLOCK');
  });

  it('allows first-aid information', () => {
    const g = new MedicalAdviceGuardrail();
    const res = g.execute('Apply pressure and call emergency services', {});
    expect(res.action).toBe('ALLOW');
  });
});
