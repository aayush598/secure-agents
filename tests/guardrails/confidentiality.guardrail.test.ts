import { describe, it, expect } from 'vitest';
import { ConfidentialityGuardrail } from '@/modules/guardrails/guards/output/confidentiality.guardrail';

describe('ConfidentialityGuardrail', () => {
  it('allows clean output', () => {
    const g = new ConfidentialityGuardrail();
    const res = g.execute('Hello world', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks confidential keywords', () => {
    const g = new ConfidentialityGuardrail();
    const res = g.execute('This is for internal use only', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('redacts when redact=true', () => {
    const g = new ConfidentialityGuardrail({ redact: true });
    const res = g.execute('Confidential document', {});
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('[REDACTED]');
  });

  it('detects environment variables', () => {
    const g = new ConfidentialityGuardrail();
    const res = g.execute('process.env.API_KEY', {});
    expect(res.action).toBe('BLOCK');
  });

  it('allows configured profiles', () => {
    const g = new ConfidentialityGuardrail({
      allowedProfiles: ['internal-admin'],
    });

    const res = g.execute('Confidential roadmap', { profileId: 'internal-admin' });

    expect(res.action).toBe('ALLOW');
  });
});
