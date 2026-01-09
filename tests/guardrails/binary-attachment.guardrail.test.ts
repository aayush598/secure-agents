import { describe, it, expect } from 'vitest';
import { BinaryAttachmentGuardrail } from '@/lib/guardrails/input/binary-attachment.guardrail';

describe('BinaryAttachmentGuardrail', () => {
  it('allows normal text input', () => {
    const g = new BinaryAttachmentGuardrail();
    const res = g.execute('Hello, how are you today?', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks base64 payloads', () => {
    const base64 = 'A'.repeat(512); // valid base64 chars
    const g = new BinaryAttachmentGuardrail();
    const res = g.execute(base64, {});
    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');
    expect(res.metadata?.detectionType).toBe('base64');
  });

  it('blocks data URLs', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA';
    const g = new BinaryAttachmentGuardrail();
    const res = g.execute(dataUrl, {});
    expect(res.passed).toBe(false);
    expect(res.metadata?.detectionType).toBe('data_url');
  });

  it('blocks binary-looking input', () => {
    const binary = '\x00\x01\x02\x03'.repeat(200);
    const g = new BinaryAttachmentGuardrail();
    const res = g.execute(binary, {});
    expect(res.passed).toBe(false);
    expect(res.metadata?.detectionType).toBe('binary');
  });

  it('allows base64 when explicitly configured', () => {
    const base64 = 'A'.repeat(512);
    const g = new BinaryAttachmentGuardrail({ allowBase64: true });
    const res = g.execute(base64, {});
    expect(res.passed).toBe(true);
  });
});
