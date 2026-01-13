import { describe, it, expect } from 'vitest';
import { TelemetryEnforcementGuardrail } from '@/modules/guardrails/guards/operational/telemetry-enforcement.guardrail';

describe('TelemetryEnforcementGuardrail', () => {
  it('allows when telemetry is enabled', () => {
    const g = new TelemetryEnforcementGuardrail();

    const res = g.execute('', {
      telemetry: {
        enabled: true,
        auditLogging: true,
        destination: 'datadog',
      },
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks when telemetry is missing', () => {
    const g = new TelemetryEnforcementGuardrail();

    const res = g.execute('', {} as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
  });

  it('warns when warnOnly is enabled', () => {
    const g = new TelemetryEnforcementGuardrail({ warnOnly: true });

    const res = g.execute('', {} as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('blocks when audit logging is required but missing', () => {
    const g = new TelemetryEnforcementGuardrail({
      requireAuditLogging: true,
    });

    const res = g.execute('', {
      telemetry: {
        enabled: true,
        auditLogging: false,
      },
    } as any);

    expect(res.action).toBe('BLOCK');
  });

  it('allows when audit logging is optional', () => {
    const g = new TelemetryEnforcementGuardrail({
      requireAuditLogging: false,
    });

    const res = g.execute('', {
      telemetry: {
        enabled: true,
      },
    } as any);

    expect(res.action).toBe('ALLOW');
  });
});
