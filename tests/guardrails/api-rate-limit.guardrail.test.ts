import { describe, it, expect, beforeEach } from 'vitest';
import {
  ApiRateLimitGuardrail,
  __resetRateLimitBuckets,
} from '@/modules/guardrails/guards/tool/api-rate-limit.guardrail';

describe('ApiRateLimitGuardrail', () => {
  beforeEach(() => {
    __resetRateLimitBuckets();
  });

  it('allows requests under the limit', () => {
    const g = new ApiRateLimitGuardrail({
      maxRequests: 3,
      windowMs: 1000,
    });

    const ctx = { apiKeyId: 'key-1' };

    const r1 = g.execute('', ctx);
    const r2 = g.execute('', ctx);

    expect(r1.passed).toBe(true);
    expect(r2.passed).toBe(true);
  });

  it('blocks when limit exceeded', () => {
    const g = new ApiRateLimitGuardrail({
      maxRequests: 2,
      windowMs: 1000,
    });

    const ctx = { apiKeyId: 'key-1' };

    g.execute('', ctx);
    g.execute('', ctx);
    const res = g.execute('', ctx);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.message).toMatch(/rate limit exceeded/i);
  });

  it('resets after window expires', async () => {
    const g = new ApiRateLimitGuardrail({
      maxRequests: 1,
      windowMs: 50,
    });

    const ctx = { apiKeyId: 'key-1' };

    g.execute('', ctx);
    await new Promise((r) => setTimeout(r, 60));

    const res = g.execute('', ctx);
    expect(res.passed).toBe(true);
  });

  it('uses userId when configured', () => {
    const g = new ApiRateLimitGuardrail({
      maxRequests: 1,
      windowMs: 1000,
      keyBy: 'userId',
    });

    const ctx = { userId: 'user-1' };

    g.execute('', ctx);
    const res = g.execute('', ctx);

    expect(res.passed).toBe(false);
  });

  it('fails open when no identifier exists', () => {
    const g = new ApiRateLimitGuardrail({
      maxRequests: 1,
      windowMs: 1000,
    });

    const res = g.execute('', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });
});
