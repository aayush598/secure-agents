import { HubTag } from '@/modules/hub/domain/hub-tags';
import { Stage } from '@/modules/hub/domain/hub-stage';

export type HubItemType = 'guardrail' | 'profile';

export interface HubItem {
  id: string;
  slug: string;
  type: HubItemType;
  name: string;
  description: string;
  tags: HubTag[];
  stage: Stage;
  icon: string;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
}
