export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { ValidateRequestSchema } from '@/modules/guardrails/contracts/validate';
import { validateRequest } from '@/modules/guardrails/service/validate-request';

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 401 });
    }

    const body = ValidateRequestSchema.parse(await req.json());

    const result = await validateRequest({
      apiKey,
      ...body,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Validation failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
