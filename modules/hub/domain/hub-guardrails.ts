import { HubCategory } from './hub-category';
import { HubTag } from '@/modules/hub/domain/hub-tags';
import { Stage } from '@/modules/hub/domain/hub-stage';

export interface HubGuardrail {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: HubCategory;
  tags: HubTag[];
  stage: Stage;
  icon: string;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
}
