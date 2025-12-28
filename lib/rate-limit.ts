import { redis } from "./redis";
import { RATE_LIMIT_LUA } from "./rate-limit-script";

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  limits?: {
    perMinute: { current: number; max: number };
    perDay: { current: number; max: number };
  };
}

function minuteKey(ts: number) {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}${d.getUTCMonth()}${d.getUTCDate()}${d.getUTCHours()}${d.getUTCMinutes()}`;
}

function dayKey(ts: number) {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}${d.getUTCMonth()}${d.getUTCDate()}`;
}

export async function checkRateLimit({
  apiKeyId,
  userId,
  apiRpm,
  apiRpd,
  userRpm,
  userRpd,
}: {
  apiKeyId: string;
  userId: string;
  apiRpm: number;
  apiRpd: number;
  userRpm: number;
  userRpd: number;
}): Promise<RateLimitResult> {
  const now = Date.now();

  const keys = [
    `rl:api:${apiKeyId}:min:${minuteKey(now)}`,
    `rl:api:${apiKeyId}:day:${dayKey(now)}`,
    `rl:user:${userId}:min:${minuteKey(now)}`,
    `rl:user:${userId}:day:${dayKey(now)}`,
  ];

  const result = (await redis.eval(
    RATE_LIMIT_LUA,
    keys.length,
    ...keys,
    apiRpm,
    apiRpd,
    userRpm,
    userRpd
  )) as number[];

  if (result[0] === 0) {
    return {
      allowed: false,
      reason: result[1] as any,
    };
  }

  return {
    allowed: true,
    limits: {
      perMinute: {
        current: result[1],
        max: apiRpm,
      },
      perDay: {
        current: result[2],
        max: apiRpd,
      },
    },
  };
}
