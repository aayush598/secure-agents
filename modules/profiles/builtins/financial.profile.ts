import { ProfileDescriptor } from '../domain/profile-descriptor';

export const FinancialProfile: ProfileDescriptor = {
  name: 'financial',
  description: 'Compliance-focused guardrails for banking, fintech, and payments',

  inputGuardrails: [
    { name: 'SecretsInInput', config: { severity: 'critical' } },
    { name: 'InputSize', config: { maxChars: 35_000 } },
    { name: 'PHIAwareness' },
    { name: 'Defamation' },
    { name: 'GDPRDataMinimization' },
  ],

  outputGuardrails: [
    { name: 'OutputPIIRedaction' },
    { name: 'Confidentiality' },
    { name: 'HallucinationRisk' },
  ],

  toolGuardrails: [{ name: 'IAMPermission' }, { name: 'ApiRateLimit' }],
};
