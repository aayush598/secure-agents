import { describe, it, expect } from 'vitest';
import { UserConsentValidationGuardrail } from '@/lib/guardrails/input/user-consent.guardrail';

describe('UserConsentValidationGuardrail', () => {
  it('blocks when consent is missing', () => {
    const g = new UserConsentValidationGuardrail();
    const res = g.execute('test', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('blocks when consent is explicitly denied', () => {
    const g = new UserConsentValidationGuardrail();
    const res = g.execute('test', {
      userConsent: { given: false },
    } as any);

    expect(res.action).toBe('BLOCK');
  });

  it('allows when valid consent is present', () => {
    const g = new UserConsentValidationGuardrail();
    const res = g.execute('test', {
      userConsent: {
        given: true,
        scope: ['profile', 'analytics'],
      },
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks when required scopes are missing', () => {
    const g = new UserConsentValidationGuardrail({
      requiredScopes: ['analytics'],
    });

    const res = g.execute('test', {
      userConsent: {
        given: true,
        scope: ['profile'],
      },
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.message).toContain('analytics');
  });

  it('warns instead of blocking when warnOnly is enabled', () => {
    const g = new UserConsentValidationGuardrail({ warnOnly: true });
    const res = g.execute('test', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('allows processing under legal basis exception', () => {
    const g = new UserConsentValidationGuardrail({
      allowedLegalBases: ['legal'],
    });

    const res = g.execute('test', {
      userConsent: {
        given: false,
        source: 'legal',
      },
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });
});
