import { describe, it, expect } from 'vitest';
import { OutputSchemaValidationGuardrail } from '@/modules/guardrails/guards/output/output-schema-validation.guardrail';

const schema = {
  type: 'object',
  required: ['answer'],
  properties: {
    answer: { type: 'string' },
    confidence: { type: 'number' },
  },
  additionalProperties: false,
};

describe('OutputSchemaValidationGuardrail', () => {
  it('allows valid JSON output matching schema', () => {
    const g = new OutputSchemaValidationGuardrail({ schema });

    const res = g.execute(JSON.stringify({ answer: 'yes', confidence: 0.9 }), {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks invalid JSON', () => {
    const g = new OutputSchemaValidationGuardrail({ schema });

    const res = g.execute('{ invalid json', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.message).toMatch(/not valid JSON/i);
  });

  it('blocks schema mismatch', () => {
    const g = new OutputSchemaValidationGuardrail({ schema });

    const res = g.execute(JSON.stringify({ confidence: 0.4 }), {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.schemaErrors?.length).toBeGreaterThan(0);
  });

  it('warns instead of blocks when warnOnly is enabled', () => {
    const g = new OutputSchemaValidationGuardrail({
      schema,
      warnOnly: true,
    });

    const res = g.execute(JSON.stringify({ confidence: 0.4 }), {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('WARN');
    expect(res.severity).toBe('warning');
  });

  it('allows non-JSON output when allowNonJson is enabled', () => {
    const g = new OutputSchemaValidationGuardrail({
      schema,
      allowNonJson: true,
    });

    const res = g.execute('plain text output', {});

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });
});
