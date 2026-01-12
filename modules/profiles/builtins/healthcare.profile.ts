import { ProfileDescriptor } from '../domain/profile-descriptor';

export const HealthcareProfile: ProfileDescriptor = {
  name: 'healthcare',
  description: 'HIPAA-aligned guardrails for healthcare and clinical AI systems',

  inputGuardrails: [
    { name: 'PHIAwareness' },
    { name: 'MedicalAdvice' },
    { name: 'SecretsInInput', config: { severity: 'critical' } },
    { name: 'InputSize', config: { maxChars: 40_000 } },
    { name: 'GDPRDataMinimization' },
    { name: 'UserConsentValidation' },
  ],

  outputGuardrails: [
    { name: 'OutputPIIRedaction' },
    { name: 'Confidentiality' },
    { name: 'RetentionCheck' },
  ],

  toolGuardrails: [],
};
