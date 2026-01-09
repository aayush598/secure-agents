// tests/unit/normalize.test.ts
import { describe, it, expect } from 'vitest';
import { normalizeGuardrailDescriptor } from '@/lib/guardrails/normalize';

describe('normalizeGuardrailDescriptor', () => {
  it('normalizes canonical object', () => {
    const d = normalizeGuardrailDescriptor({ name: 'InputSize', config: { max: 10 } });
    expect(d).toEqual({ name: 'InputSize', config: { max: 10 } });
  });

  it('normalizes legacy class format', () => {
    const d = normalizeGuardrailDescriptor({ class: 'NSFWAdvancedGuardrail', config: {} });
    expect(d?.name).toBe('NSFWAdvanced');
  });

  it('normalizes legacy string format', () => {
    const d = normalizeGuardrailDescriptor('SecretsInInputGuardrail');
    expect(d).toEqual({ name: 'SecretsInInput' });
  });

  it('returns null for invalid input', () => {
    expect(normalizeGuardrailDescriptor(null)).toBeNull();
    expect(normalizeGuardrailDescriptor(123)).toBeNull();
  });
});
