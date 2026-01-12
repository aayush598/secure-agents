import { DefaultProfile } from '@/modules/profiles/builtins/default.profile';
import { EnterpriseSecurityProfile } from '@/modules/profiles/builtins/enterprise.profile';
import { ChildSafetyProfile } from '@/modules/profiles/builtins/child-safety.profile';
import { HealthcareProfile } from '@/modules/profiles/builtins/healthcare.profile';
import { FinancialProfile } from '@/modules/profiles/builtins/financial.profile';
import { MinimalProfile } from '@/modules/profiles/builtins/minimal.profile';

export const BUILTIN_PROFILES = [
  DefaultProfile,
  EnterpriseSecurityProfile,
  ChildSafetyProfile,
  HealthcareProfile,
  FinancialProfile,
  MinimalProfile,
];
