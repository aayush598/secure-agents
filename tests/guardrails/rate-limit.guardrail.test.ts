import { describe, it, expect, beforeEach } from 'vitest';
import { RateLimitGuardrail } from '@/modules/guardrails/guards/operational/rate-limit.guardrail';

describe('RateLimitGuardrail', () => {
  beforeEach(() => {
    RateLimitGuardrail.__clearStore();
  });

  it('allows requests under the limit', () => {
    const g = new RateLimitGuardrail({
      limit: 3,
      windowMs: 10_000,
    });

    const ctx = { userId: 'u1' };

    expect(g.execute('', ctx).action).toBe('ALLOW');
    expect(g.execute('', ctx).action).toBe('ALLOW');
    expect(g.execute('', ctx).action).toBe('ALLOW');
  });

  it('blocks when limit is exceeded', () => {
    const g = new RateLimitGuardrail({
      limit: 2,
      windowMs: 10_000,
    });

    const ctx = { apiKeyId: 'k1' };

    g.execute('', ctx);
    g.execute('', ctx);

    const res = g.execute('', ctx);

    expect(res.action).toBe('BLOCK');
    expect(res.passed).toBe(false);
    expect(res.metadata?.retryAfterMs).toBeGreaterThan(0);
  });

  it('warns when nearing limit', () => {
    const g = new RateLimitGuardrail({
      limit: 5,
      windowMs: 10_000,
      warnThreshold: 1,
    });

    const ctx = { userId: 'warn' };

    g.execute('', ctx);
    g.execute('', ctx);
    g.execute('', ctx);
    g.execute('', ctx);

    const res = g.execute('', ctx);

    expect(res.action).toBe('WARN');
    expect(res.passed).toBe(true);
  });

  it('resets after window expires', async () => {
    const g = new RateLimitGuardrail({
      limit: 1,
      windowMs: 10,
    });

    const ctx = { userId: 'reset' };

    g.execute('', ctx);
    await new Promise((r) => setTimeout(r, 15));

    const res = g.execute('', ctx);
    expect(res.action).toBe('ALLOW');
  });
});
