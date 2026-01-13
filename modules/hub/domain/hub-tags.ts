/**
 * Hub-wide tag taxonomy
 * Used for filtering, search, and categorization
 */
export const HUB_TAGS = [
  // Core flow
  'input',
  'output',
  'tool',

  // Security & privacy
  'security',
  'privacy',
  'compliance',
  'secrets',
  'policy',
  'legal',

  // Safety
  'content-safety',
  'health',
  'healthcare',
  'validation',

  // Ops & platform
  'operations',
  'cost',
  'quality',
  'performance',
  'observability',
  'stability',

  // Advanced / custom
  'custom',
  'ml',
  'tooling',

  // Business
  'enterprise',
  'finance',
] as const;

export type HubTag = (typeof HUB_TAGS)[number];
