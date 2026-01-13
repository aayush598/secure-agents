import { describe, it, expect } from 'vitest';
import { SecretLeakOutputGuardrail } from '@/modules/guardrails/guards/output/secret-leak-output.guardrail';

describe('SecretLeakOutputGuardrail', () => {
  it('allows safe output', () => {
    const g = new SecretLeakOutputGuardrail();
    const res = g.execute('Hello world', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('detects and redacts secrets by default', () => {
    const g = new SecretLeakOutputGuardrail();

    const res = g.execute('Here is the key: sk-123456789012345678901234', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('[REDACTED_SECRET]');
    expect(res.metadata?.count).toBe(1);
  });

  it('blocks output when blockOnDetection is enabled', () => {
    const g = new SecretLeakOutputGuardrail({
      blockOnDetection: true,
    });

    const res = g.execute('JWT token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.sig', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.redactedText).toBeUndefined();
  });

  it('supports custom redaction token', () => {
    const g = new SecretLeakOutputGuardrail({
      redactWith: '<SECRET>',
    });

    const res = g.execute('AWS key: AKIA1234567890ABCDEF', {});

    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('<SECRET>');
  });
});
