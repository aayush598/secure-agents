export interface ValidateInputRequest {
  text: string;
  profileName: string;
  validationType: 'input' | 'output' | 'tool';
}

export interface GuardrailResult {
  guardrailName: string;
  passed: boolean;
  action: 'ALLOW' | 'WARN' | 'BLOCK' | 'MODIFY';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface ValidateResponse {
  passed: boolean;
  executionTimeMs: number;
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  results: GuardrailResult[];
}
