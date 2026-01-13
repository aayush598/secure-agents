import { nanoid } from 'nanoid';

export function generateApiKey(): string {
  // Format: grd_live_xxxxx (grd = guardrails)
  return `grd_live_${nanoid(32)}`;
}

export function validateApiKeyFormat(key: string): boolean {
  return /^grd_live_[a-zA-Z0-9_-]{32}$/.test(key);
}
