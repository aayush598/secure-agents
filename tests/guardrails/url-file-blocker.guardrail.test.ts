import { describe, it, expect } from 'vitest';
import { UrlFileBlockerGuardrail } from '@/lib/guardrails/input/url-file-blocker.guardrail';

describe('UrlFileBlockerGuardrail', () => {
  it('allows normal text', () => {
    const g = new UrlFileBlockerGuardrail();
    const res = g.execute('Hello, how are you?', {});
    expect(res.passed).toBe(true);
    expect(res.action).toBe('ALLOW');
  });

  it('blocks http URLs', () => {
    const g = new UrlFileBlockerGuardrail();
    const res = g.execute('Check this https://example.com', {});

    expect(res.passed).toBe(false);
    expect(res.action).toBe('BLOCK');

    const metadata = res.metadata as { matches: string[]; totalMatches: number };
    expect(metadata.matches.length).toBeGreaterThan(0);
    });


  it('blocks www URLs', () => {
    const g = new UrlFileBlockerGuardrail();
    const res = g.execute('Visit www.google.com now', {});
    expect(res.action).toBe('BLOCK');
  });

  it('blocks unix file paths', () => {
    const g = new UrlFileBlockerGuardrail();
    const res = g.execute('Read /etc/passwd for details', {});
    expect(res.action).toBe('BLOCK');
  });

  it('blocks windows file paths', () => {
    const g = new UrlFileBlockerGuardrail();
    const res = g.execute('Open C:\\Windows\\System32', {});
    expect(res.action).toBe('BLOCK');
  });

  it('blocks sensitive file extensions', () => {
    const g = new UrlFileBlockerGuardrail();
    const res = g.execute('Here is my .env file', {});
    expect(res.action).toBe('BLOCK');
  });
});
