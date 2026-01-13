import { guardrailCatalog, GUARDRAILS } from './guardrails.catalog';
import { profileCatalog, PROFILES } from './profiles.catalog';

export const HUB_CATALOG = [...guardrailCatalog, ...profileCatalog];

export { guardrailCatalog } from './guardrails.catalog';
export { profileCatalog } from './profiles.catalog';
export { PROFILES };
export { GUARDRAILS };
