import { GuardrailsSDKConfig } from '../core/config';
import { httpRequest } from '../core/http';
import { ValidateInputRequest, ValidateResponse } from './types';

export function validate(config: GuardrailsSDKConfig) {
  return async (request: ValidateInputRequest): Promise<ValidateResponse> => {
    return httpRequest<ValidateResponse>(
      `${config.baseUrl}/api/validate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey && {
            'x-api-key': config.apiKey,
          }),
        },
        body: JSON.stringify(request),
      },
      config.timeoutMs,
    );
  };
}
