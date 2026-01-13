import { HubItem } from '../domain/hub-item';

export function computeHubStats(items: HubItem[]) {
  return {
    total: items.length,
    guardrails: items.filter((i) => i.type === 'guardrail').length,
    profiles: items.filter((i) => i.type === 'profile').length,
  };
}
