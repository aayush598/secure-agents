import { describe, it, expect } from 'vitest';
import { HateSpeechGuardrail } from '@/lib/guardrails/input/hate-speech.guardrail';

describe('HateSpeechGuardrail', () => {
  it('allows neutral content', () => {
    const g = new HateSpeechGuardrail();
    const res = g.execute('Hello world', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks hate slurs', () => {
    const g = new HateSpeechGuardrail();
    const res = g.execute('I hate those faggot people', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.matchedTerms).toContain('faggot');
  });

  it('blocks violent hate speech with critical severity', () => {
    const g = new HateSpeechGuardrail();
    const res = g.execute('We should kill those nigger groups', {});
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
    expect(res.metadata?.violent).toBe(true);
  });

  it('warns instead of blocking in moderate mode', () => {
    const g = new HateSpeechGuardrail({ blockSeverity: 'moderate' });
    const res = g.execute('Those chink people are disgusting', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('allows quoted context when enabled', () => {
    const g = new HateSpeechGuardrail({ allowQuotedContext: true });
    const res = g.execute('He said "those people are inferior" in the report', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('detects custom slurs', () => {
    const g = new HateSpeechGuardrail({ customSlurs: ['customslur'] });
    const res = g.execute('This is a customslur', {});
    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.matchedTerms).toContain('customslur');
  });
});
