import { GuardrailsSDKConfig } from './config';
import { validate as createValidate } from '../guardrails/validate';
import { ValidateInputRequest, ValidateResponse } from '../guardrails/types';

export class GuardrailsClient {
  private readonly config: GuardrailsSDKConfig;

  // Explicitly typed public method
  public readonly validate: (req: ValidateInputRequest) => Promise<ValidateResponse>;

  constructor(config: GuardrailsSDKConfig) {
    this.config = {
      timeoutMs: 10_000,
      retries: 0,
      ...config,
    };

    // Initialize methods AFTER config exists
    this.validate = createValidate(this.config);
  }
}
