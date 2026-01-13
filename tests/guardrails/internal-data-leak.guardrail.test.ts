import { describe, it, expect } from 'vitest';
import { InternalDataLeakGuardrail } from '@/modules/guardrails/guards/output/internal-data-leak.guardrail';

describe('InternalDataLeakGuardrail', () => {
  it('allows clean output', () => {
    const g = new InternalDataLeakGuardrail();
    const res = g.execute('Hello world', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks internal domain references', () => {
    const g = new InternalDataLeakGuardrail();
    const res = g.execute('Service is available at api.internal', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('blocks private IP addresses', () => {
    const g = new InternalDataLeakGuardrail();
    const res = g.execute('Connect to 10.0.0.12 for debugging', {});

    expect(res.action).toBe('BLOCK');
  });

  it('detects filesystem paths', () => {
    const g = new InternalDataLeakGuardrail();
    const res = g.execute('Error in /etc/passwd at line 3', {});

    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.matches.length).toBeGreaterThan(0);
  });

  it('supports warn-only mode', () => {
    const g = new InternalDataLeakGuardrail({ warnOnly: true });
    const res = g.execute('Access /internal/admin for details', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });
});
