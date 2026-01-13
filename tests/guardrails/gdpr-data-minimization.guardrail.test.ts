import { describe, it, expect } from 'vitest';
import { GDPRDataMinimizationGuardrail } from '@/modules/guardrails/guards/input/gdpr-data-minimization.guardrail';

describe('GDPRDataMinimizationGuardrail', () => {
  it('allows minimal personal data', () => {
    const g = new GDPRDataMinimizationGuardrail({
      allowedFields: ['email'],
    });

    const res = g.execute('Contact me at test@example.com', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks excessive personal data', () => {
    const g = new GDPRDataMinimizationGuardrail({
      allowedFields: ['email'],
    });

    const res = g.execute('My email is test@example.com and my SSN is 123-45-6789', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('warns instead of blocking when warnOnly is enabled', () => {
    const g = new GDPRDataMinimizationGuardrail({
      allowedFields: ['email'],
      warnOnly: true,
    });

    const res = g.execute('Email: test@example.com, SSN: 123-45-6789', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('allows empty input', () => {
    const g = new GDPRDataMinimizationGuardrail();
    const res = g.execute('', {});
    expect(res.action).toBe('ALLOW');
  });

  it('respects maxPersonalDataItems', () => {
    const g = new GDPRDataMinimizationGuardrail({
      maxPersonalDataItems: 1,
    });

    const res = g.execute('Email test@example.com and phone 1234567890', {});

    expect(res.action).toBe('BLOCK');
  });
});
