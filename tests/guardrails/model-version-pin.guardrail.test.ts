import { describe, it, expect } from 'vitest';
import { ModelVersionPinGuardrail } from '@/modules/guardrails/guards/operational/model-version-pin.guardrail';

describe('ModelVersionPinGuardrail', () => {
  const config = {
    allowedModels: ['gpt-4.1-2024-11-20'],
  };

  it('allows when no model is provided', () => {
    const g = new ModelVersionPinGuardrail(config);
    const res = g.execute('', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks unversioned model names', () => {
    const g = new ModelVersionPinGuardrail(config);
    const res = g.execute('', { model: 'gpt-4' } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.message).toMatch(/not version-pinned/);
  });

  it('blocks explicitly versioned but unapproved models', () => {
    const g = new ModelVersionPinGuardrail(config);
    const res = g.execute('', {
      model: 'gpt-4.1-2024-10-01',
    } as any);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.message).toMatch(/not in the allowed model list/);
  });

  it('allows explicitly pinned approved model', () => {
    const g = new ModelVersionPinGuardrail(config);
    const res = g.execute('', {
      model: 'gpt-4.1-2024-11-20',
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('warns instead of blocking when strict=false', () => {
    const g = new ModelVersionPinGuardrail({
      allowedModels: ['gpt-4.1-2024-11-20'],
      strict: false,
    });

    const res = g.execute('', {
      model: 'gpt-4.1-2024-10-01',
    } as any);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('throws if allowedModels is empty', () => {
    expect(
      () =>
        new ModelVersionPinGuardrail({
          allowedModels: [],
        }),
    ).toThrow(/requires allowedModels/);
  });
});
