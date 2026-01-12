import { describe, it, expect } from 'vitest';
import { EnvVarLeakGuardrail } from '@/lib/guardrails/output/env-var-leak.guardrail';

describe('EnvVarLeakGuardrail', () => {
  it('allows output with no env vars', () => {
    const g = new EnvVarLeakGuardrail();
    const res = g.execute('Hello world');

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks process.env leaks', () => {
    const g = new EnvVarLeakGuardrail();
    const res = g.execute('The key is process.env.OPENAI_API_KEY');

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('blocks shell-style env var leaks', () => {
    const g = new EnvVarLeakGuardrail();
    const res = g.execute('Deploy using $DATABASE_URL');

    expect(res.action).toBe('BLOCK');
  });

  it('redacts env vars when redact=true', () => {
    const g = new EnvVarLeakGuardrail({ redact: true });
    const res = g.execute('Token: ${JWT_SECRET}');

    expect(res.passed).toBe(true);
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('[REDACTED_ENV_VAR]');
  });

  it('supports custom sensitive vars', () => {
    const g = new EnvVarLeakGuardrail({
      sensitiveVars: ['CUSTOM_SECRET'],
    });

    const res = g.execute('Value is $CUSTOM_SECRET');
    expect(res.action).toBe('BLOCK');
  });
});
