import { describe, it, expect } from 'vitest';
import { DestructiveToolCallGuardrail } from '@/modules/guardrails/guards/tool/destructive-tool-call.guardrail';
import { createToolContext } from '../fixtures/tool-context';

describe('DestructiveToolCallGuardrail', () => {
  it('allows when no tool context exists', () => {
    const g = new DestructiveToolCallGuardrail();
    const res = g.execute('', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('allows safe tool invocation', () => {
    const g = new DestructiveToolCallGuardrail();
    const ctx = createToolContext({
      toolName: 'shell.exec',
      toolArgs: { command: 'ls -la /tmp' },
    });

    const res = g.execute('', ctx);
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks destructive command', () => {
    const g = new DestructiveToolCallGuardrail();
    const ctx = createToolContext({
      toolName: 'shell.exec',
      toolArgs: { command: 'rm -rf /' },
    });

    const res = g.execute('', ctx);

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.severity).toBe('critical');
    expect(res.metadata?.matchedPattern).toBeDefined();
  });

  it('warns instead of blocking when warnOnly is enabled', () => {
    const g = new DestructiveToolCallGuardrail({ warnOnly: true });
    const ctx = createToolContext({
      toolName: 'shell.exec',
      toolArgs: { command: 'rm -rf /' },
    });

    const res = g.execute('', ctx);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('WARN');
  });

  it('allows explicitly allowlisted destructive tool', () => {
    const g = new DestructiveToolCallGuardrail({
      allowlist: ['shell.exec'],
    });

    const ctx = createToolContext({
      toolName: 'shell.exec',
      toolArgs: { command: 'rm -rf /' },
    });

    const res = g.execute('', ctx);

    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });
});
