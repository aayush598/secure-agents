import { describe, it, expect } from 'vitest';
import { SelfHarmGuardrail } from '@/modules/guardrails/guards/input/self-harm.guardrail';

describe('SelfHarmGuardrail', () => {
  it('allows safe content', () => {
    const g = new SelfHarmGuardrail();
    const res = g.execute('Hello, how are you?', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns on passive references', () => {
    const g = new SelfHarmGuardrail();
    const res = g.execute('The movie discusses suicide themes', {});
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('blocks active self-harm ideation', () => {
    const g = new SelfHarmGuardrail();
    const res = g.execute('I want to die', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('blocks imminent self-harm intent', () => {
    const g = new SelfHarmGuardrail();
    const res = g.execute('I am going to kill myself tonight', {});
    expect(res.action).toBe('BLOCK');
    expect(res.message).toMatch(/imminent/i);
  });

  it('blocks passive references in strict mode', () => {
    const g = new SelfHarmGuardrail({ strictMode: true });
    const res = g.execute('Self-harm is discussed here', {});
    expect(res.action).toBe('BLOCK');
  });
});
