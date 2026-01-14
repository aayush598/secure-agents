import { db } from '@/shared/db/client';
import { profiles } from '@/shared/db/schema';
import { and, eq } from 'drizzle-orm';
import { BUILTIN_PROFILES } from '@/modules/profiles/builtins';

export async function resolveProfile(params: { userId: string; profileName: string }) {
  const { userId, profileName } = params;

  // 1. User-defined profile
  const dbProfile = await db.query.profiles.findFirst({
    where: and(eq(profiles.userId, userId), eq(profiles.name, profileName)),
  });

  if (dbProfile) return dbProfile;

  // 2. Built-in fallback
  const builtin = BUILTIN_PROFILES.find((p) => p.name === profileName);
  if (!builtin) {
    throw new Error('Profile not found');
  }

  return {
    id: `builtin:${builtin.name}`,
    name: builtin.name,
    inputGuardrails: builtin.inputGuardrails,
    outputGuardrails: builtin.outputGuardrails,
  };
}
