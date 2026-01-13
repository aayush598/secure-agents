import { describe, it, expect } from 'vitest';
import { InternalEndpointLeakGuardrail } from '@/modules/guardrails/guards/output/internal-endpoint.guardrail';

describe('InternalEndpointLeakGuardrail', () => {
  it('allows safe public URLs', () => {
    const g = new InternalEndpointLeakGuardrail();

    const res = g.execute('Call https://api.example.com/v1/users', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks localhost endpoint', () => {
    const g = new InternalEndpointLeakGuardrail();

    const res = g.execute('Service available at http://localhost:3000/admin', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('blocks private IP address', () => {
    const g = new InternalEndpointLeakGuardrail();

    const res = g.execute('Database running on 10.0.1.42:5432', {});

    expect(res.action).toBe('BLOCK');
  });

  it('redacts endpoints when redact=true', () => {
    const g = new InternalEndpointLeakGuardrail({ redact: true });

    const res = g.execute('Connect to 192.168.1.10:3306 for access', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('[REDACTED_INTERNAL_ENDPOINT]');
  });

  it('detects kubernetes service DNS', () => {
    const g = new InternalEndpointLeakGuardrail();

    const res = g.execute('Internal call to auth.svc.cluster.local', {});

    expect(res.action).toBe('BLOCK');
  });
});
