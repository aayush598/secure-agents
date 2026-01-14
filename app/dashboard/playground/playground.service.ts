import type { ValidateRequest, ValidateResponse } from '@/modules/guardrails/contracts/validate';

export async function validateText(
  payload: ValidateRequest,
  apiKey: string,
): Promise<ValidateResponse> {
  const res = await fetch('/api/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Validation failed');
  }

  return data;
}
