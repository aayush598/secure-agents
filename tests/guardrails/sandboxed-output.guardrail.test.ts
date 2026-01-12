import { describe, it, expect } from 'vitest';
import { SandboxedOutputGuardrail } from '@/lib/guardrails/output/sandboxed-output.guardrail';

describe('SandboxedOutputGuardrail', () => {
  it('allows normal explanatory text', () => {
    const g = new SandboxedOutputGuardrail();

    const res = g.execute('This is a general explanation of how systems work.', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks shell commands by default', () => {
    const g = new SandboxedOutputGuardrail();

    const res = g.execute('Run: rm -rf /', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('error');
  });

  it('redacts executable output when in MODIFY mode', () => {
    const g = new SandboxedOutputGuardrail({ mode: 'MODIFY' });

    const res = g.execute('Use sudo chmod 777 /etc/passwd', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('MODIFY');
    expect(res.redactedText).toContain('[REDACTED_EXECUTABLE]');
  });

  it('detects shebang scripts', () => {
    const g = new SandboxedOutputGuardrail();

    const res = g.execute('#!/bin/bash\necho hello', {});

    expect(res.action).toBe('BLOCK');
  });

  it('supports custom patterns', () => {
    const g = new SandboxedOutputGuardrail({
      extraPatterns: [/dangerous_custom_call\(/i],
    });

    const res = g.execute('dangerous_custom_call()', {});

    expect(res.action).toBe('BLOCK');
  });
});
