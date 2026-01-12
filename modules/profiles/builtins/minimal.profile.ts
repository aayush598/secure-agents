import { ProfileDescriptor } from '../domain/profile-descriptor';

export const MinimalProfile: ProfileDescriptor = {
  name: 'minimal',
  description: 'Minimal guardrails for development, testing, and experimentation',

  inputGuardrails: [{ name: 'InputSize', config: { maxChars: 100_000 } }],

  outputGuardrails: [],

  toolGuardrails: [],
};
