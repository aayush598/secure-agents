import { describe, it, expect } from 'vitest';
import { RightToErasureGuardrail } from '@/lib/guardrails/input/right-to-erasure.guardrail';

describe('RightToErasureGuardrail', () => {
  it('allows normal input', () => {
    const g = new RightToErasureGuardrail();
    const res = g.execute('Hello, how are you?', {});
    expect(res.action).toBe('ALLOW');
    expect(res.passed).toBe(true);
  });

  it('detects explicit erasure request', () => {
    const g = new RightToErasureGuardrail();
    const res = g.execute('Please delete all my personal data immediately', {});

    expect(res.action).toBe('WARN');
    expect(res.passed).toBe(true);
    expect(res.metadata?.requestType).toBe('right_to_erasure');
    expect(res.metadata?.confidence).toBeGreaterThan(0.9);
  });

  it('detects GDPR regulatory language', () => {
    const g = new RightToErasureGuardrail();
    const res = g.execute('This is a GDPR Article 17 data subject request', {});

    expect(res.action).toBe('WARN');
    expect(res.metadata?.legalBasis).toContain('GDPR Article 17');
  });

  it('ignores low confidence signals', () => {
    const g = new RightToErasureGuardrail({ minConfidence: 0.9 });
    const res = g.execute('remove profile', {});

    expect(res.action).toBe('ALLOW');
  });

  it('handles empty input safely', () => {
    const g = new RightToErasureGuardrail();
    const res = g.execute('', {});
    expect(res.action).toBe('ALLOW');
  });
});
