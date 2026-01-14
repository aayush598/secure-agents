import { z } from 'zod';
import { GuardrailResult } from '@/modules/guardrails/descriptors/types';

export const ValidateRequestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  profileName: z.string(),
  validationType: z.enum(['input', 'output', 'both']).default('input'),
});

export type ValidateRequest = z.infer<typeof ValidateRequestSchema>;

export interface ValidateResponse {
  passed: boolean;
  profile: {
    id: string;
    name: string;
  };
  validationType: 'input' | 'output' | 'both';
  results: GuardrailResult[];
  summary: {
    total: number;
    failed: number;
  };
  executionTimeMs: number;
  rateLimits?: unknown;
}
