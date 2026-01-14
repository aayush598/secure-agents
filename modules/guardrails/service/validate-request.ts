import { db } from '@/shared/db/client';
import { apiKeys } from '@/shared/db/schema';
import { and, eq } from 'drizzle-orm';
import { checkRateLimit } from '@/lib/rate-limit';
import { runGuardrails } from './run-guardrails';
import { resolveProfile } from '@/modules/profiles/service/profile-resolver';
import { guardrailExecutions } from '@/shared/db/schema';

interface ValidateRequestInput {
  apiKey: string;
  text: string;
  profileName: string;
  validationType: 'input' | 'output' | 'both';
}

export async function validateRequest(input: ValidateRequestInput) {
  const key = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.key, input.apiKey), eq(apiKeys.isActive, true)),
  });

  if (!key) {
    throw new Error('Invalid API key');
  }

  const rate = await checkRateLimit(key.id, key.userId);
  if (!rate.allowed) {
    throw new Error(rate.reason);
  }

  const profile = await resolveProfile({
    userId: key.userId,
    profileName: input.profileName,
  });

  const guardrails =
    input.validationType === 'input'
      ? profile.inputGuardrails
      : input.validationType === 'output'
        ? profile.outputGuardrails
        : [...profile.inputGuardrails, ...profile.outputGuardrails];

  const executionValidationType: 'input' | 'output' =
    input.validationType === 'output' ? 'output' : 'input';

  const result = await runGuardrails(guardrails, input.text, {
    validationType: executionValidationType,
    userId: key.userId,
    apiKeyId: key.id,
    profileId: profile.id,
  });

  await db.insert(guardrailExecutions).values({
    userId: key.userId,
    apiKeyId: key.id,
    profileId: profile.id,
    inputText: input.validationType === 'input' ? input.text : null,
    outputText: input.validationType === 'output' ? input.text : null,
    guardrailResults: result.results,
    passed: result.passed,
    executionTimeMs: result.executionTimeMs,
  });

  return {
    passed: result.passed,
    profile: { id: profile.id, name: profile.name },
    validationType: input.validationType,
    results: result.results,
    summary: result.summary,
    executionTimeMs: result.executionTimeMs,
    rateLimits: rate.limits,
  };
}
