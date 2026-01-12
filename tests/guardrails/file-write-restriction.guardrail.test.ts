import { describe, it, expect } from 'vitest';
import { FileWriteRestrictionGuardrail } from '@/lib/guardrails/tool/file-write-restriction.guardrail';

describe('FileWriteRestrictionGuardrail', () => {
  it('allows when no tool context exists', () => {
    const g = new FileWriteRestrictionGuardrail();
    const res = g.execute('', {});
    expect(res.passed).toBe(true);
  });

  it('blocks write to restricted directory', () => {
    const g = new FileWriteRestrictionGuardrail({
      blockedWriteDirs: ['/etc'],
    });

    const res = g.execute('', {
      toolAccess: {
        toolName: 'fs.write',
        toolArgs: { path: '/etc/passwd' },
      },
    } as any);

    expect(res.action).toBe('BLOCK');
    expect(res.passed).toBe(false);
  });

  it('blocks hidden file writes', () => {
    const g = new FileWriteRestrictionGuardrail();

    const res = g.execute('', {
      toolAccess: {
        toolName: 'file.write',
        toolArgs: { path: '/tmp/.env' },
      },
    } as any);

    expect(res.action).toBe('BLOCK');
  });

  it('allows write inside allowed directory', () => {
    const g = new FileWriteRestrictionGuardrail({
      allowedWriteDirs: ['/tmp'],
    });

    const res = g.execute('', {
      toolAccess: {
        toolName: 'file.write',
        toolArgs: { path: '/tmp/output.txt' },
      },
    } as any);

    expect(res.action).toBe('ALLOW');
    expect(res.passed).toBe(true);
  });

  it('blocks oversized file', () => {
    const g = new FileWriteRestrictionGuardrail({
      maxFileSizeBytes: 1024,
    });

    const res = g.execute('', {
      toolAccess: {
        toolName: 'file.write',
        toolArgs: { path: '/tmp/a.txt', size: 2048 },
      },
    } as any);

    expect(res.action).toBe('BLOCK');
  });
});
