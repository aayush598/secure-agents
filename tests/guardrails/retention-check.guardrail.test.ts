import { describe, it, expect } from 'vitest';
import { RetentionCheckGuardrail } from '@/modules/guardrails/guards/general/retention-check.guardrail';

describe('RetentionCheckGuardrail', () => {
  it('allows when no retention metadata is present', () => {
    const g = new RetentionCheckGuardrail();
    const res = g.execute('test', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('allows valid retention window', () => {
    const g = new RetentionCheckGuardrail();
    const res = g.execute('test', {
      retention: {
        createdAt: new Date(),
        retentionDays: 30,
        policyId: 'policy-1',
      },
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks expired retention by default', () => {
    const past = Date.now() - 40 * 24 * 60 * 60 * 1000;

    const g = new RetentionCheckGuardrail();
    const res = g.execute('test', {
      retention: {
        createdAt: new Date(past),
        retentionDays: 30,
        policyId: 'policy-2',
      },
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('warns instead of blocking when blockOnExpiry is false', () => {
    const past = Date.now() - 40 * 24 * 60 * 60 * 1000;

    const g = new RetentionCheckGuardrail({ blockOnExpiry: false });
    const res = g.execute('test', {
      retention: {
        createdAt: new Date(past),
        retentionDays: 30,
      },
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('allows expired data when legal hold is active', () => {
    const past = Date.now() - 365 * 24 * 60 * 60 * 1000;

    const g = new RetentionCheckGuardrail();
    const res = g.execute('test', {
      retention: {
        createdAt: new Date(past),
        retentionDays: 30,
        legalHold: true,
      },
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks invalid createdAt timestamp', () => {
    const g = new RetentionCheckGuardrail();
    const res = g.execute('test', {
      retention: {
        createdAt: 'not-a-date',
        retentionDays: 30,
      },
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
  });
});
