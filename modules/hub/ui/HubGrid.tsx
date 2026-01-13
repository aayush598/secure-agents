import { HubItem } from '../domain/hub-item';
import { HubCard } from './HubCard';
import { HubEmptyState } from './HubEmptyState';

export function HubGrid({ items }: { items: HubItem[] }) {
  if (items.length === 0) return <HubEmptyState />;

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <HubCard key={item.id} item={item} />
      ))}
    </div>
  );
}
