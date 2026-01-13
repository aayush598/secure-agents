// tests/unit/normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeDescriptor } from '@/modules/guardrails/descriptors/normalize';

describe('normalizeGuardrailDescriptor', () => {
  it('normalizes canonical object', () => {
    const d = normalizeDescriptor({ name: 'InputSize', config: { max: 10 } });
    expect(d).toEqual({ name: 'InputSize', config: { max: 10 } });
  });

  it('normalizes legacy class format', () => {
    const d = normalizeDescriptor({ class: 'NSFWAdvancedGuardrail', config: {} });
    expect(d?.name).toBe('NSFWAdvanced');
  });

  it('normalizes legacy string format', () => {
    const d = normalizeDescriptor('SecretsInInputGuardrail');
    expect(d).toEqual({ name: 'SecretsInInput' });
  });

  it('returns null for invalid input', () => {
    expect(normalizeDescriptor(null)).toBeNull();
    expect(normalizeDescriptor(123)).toBeNull();
  });
});
