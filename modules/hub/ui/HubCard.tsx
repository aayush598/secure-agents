import Link from 'next/link';
import { HubItem } from '../domain/hub-item';
import { Badge } from '@/shared/ui/badge';
import { HubIcon } from '@/app/(marketing)/hub/icon-map';

export function HubCard({ item }: { item: HubItem }) {
  return (
    <Link
      href={`/hub/${item.type}s/${item.slug}`}
      className="rounded-xl border bg-white p-6 transition hover:shadow-lg"
    >
      <div className="mb-3 flex justify-between">
        <HubIcon name={item.icon} />
        <Badge>{item.type}</Badge>
      </div>

      <h3 className="font-bold">{item.name}</h3>
      <p className="line-clamp-2 text-sm text-slate-600">{item.description}</p>
    </Link>
  );
}
