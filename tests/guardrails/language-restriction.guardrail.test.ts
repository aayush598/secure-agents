import { describe, it, expect } from 'vitest';
import { LanguageRestrictionGuardrail } from '@/modules/guardrails/guards/input/language-restriction.guardrail';

describe('LanguageRestrictionGuardrail', () => {
  it('allows pure English text', () => {
    const g = new LanguageRestrictionGuardrail();
    const res = g.execute('Hello, how are you?');

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks non-Latin language by default', () => {
    const g = new LanguageRestrictionGuardrail();
    const res = g.execute('Привет как дела');

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
  });

  it('allows configured script (Cyrillic)', () => {
    const g = new LanguageRestrictionGuardrail({
      allowedScripts: ['latin', 'cyrillic'],
    });

    const res = g.execute('Привет как дела');
    expect(res.passed).toBe(true);
  });

  it('allows small amount of foreign script', () => {
    const g = new LanguageRestrictionGuardrail({
      minAllowedRatio: 0.8,
    });

    const res = g.execute('Hello 世界');
    expect(res.passed).toBe(true);
  });

  it('warns instead of blocking when warnOnly is enabled', () => {
    const g = new LanguageRestrictionGuardrail({
      warnOnly: true,
    });

    const res = g.execute('مرحبا كيف حالك');

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('ignores emojis and punctuation', () => {
    const g = new LanguageRestrictionGuardrail();
    const res = g.execute('Hello 😊!!!');

    expect(res.passed).toBe(true);
  });
});
