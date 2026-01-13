// tests/guardrails/nsfw.guardrail.test.ts
import { describe, it, expect } from 'vitest';
import { NSFWAdvancedGuardrail } from '@/modules/guardrails/guards/input/nsfw.guardrail';

describe('NSFWAdvancedGuardrail', () => {
  it('allows safe content', () => {
    const g = new NSFWAdvancedGuardrail();
    const res = g.execute('Hello world', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks explicit sexual content', () => {
    const g = new NSFWAdvancedGuardrail();
    const res = g.execute('explicit sexual intercourse content', {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
  });

  it('allows contextual sexual content for age-verified users', () => {
    const g = new NSFWAdvancedGuardrail();
    const res = g.execute('sensual romantic scene', { ageVerified: true });

    expect(res.action).toBe('ALLOW');
    expect(res.passed).toBe(true);
  });
});
