import { describe, it, expect } from 'vitest';
import { RegexFilterGuardrail } from '@/modules/guardrails/guards/input/regex-filter.guardrail';

describe('RegexFilterGuardrail', () => {
  it('allows input when no rules match', () => {
    const g = new RegexFilterGuardrail({
      rules: [{ pattern: 'password', action: 'BLOCK' }],
    });

    const res = g.execute('hello world', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks input when rule matches', () => {
    const g = new RegexFilterGuardrail({
      rules: [{ pattern: 'password', action: 'BLOCK', message: 'Passwords forbidden' }],
    });

    const res = g.execute('my password is 123', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.message).toBe('Passwords forbidden');
  });

  it('warns when WARN rule matches', () => {
    const g = new RegexFilterGuardrail({
      rules: [{ pattern: 'internal', action: 'WARN' }],
    });

    const res = g.execute('internal documentation', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('respects rule order (first match wins)', () => {
    const g = new RegexFilterGuardrail({
      rules: [
        { pattern: 'test', action: 'WARN' },
        { pattern: 'test', action: 'BLOCK' },
      ],
    });

    const res = g.execute('test string', {});
    expect(res.action).toBe('WARN');
  });

  it('throws on invalid regex', () => {
    expect(() => {
      new RegexFilterGuardrail({
        rules: [{ pattern: '[unterminated', action: 'BLOCK' }],
      });
    }).toThrow(/Invalid regex/);
  });
});
