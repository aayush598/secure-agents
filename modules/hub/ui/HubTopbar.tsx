import { HubSortKey } from '../domain/hub-sort';

export function HubTopbar({
  query,
  sortBy,
  onQueryChange,
  onSortChange,
}: {
  query: string;
  sortBy: HubSortKey;
  onQueryChange: (v: string) => void;
  onSortChange: (v: HubSortKey) => void;
}) {
  return (
    <div className="flex gap-4">
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search..."
        className="flex-1 rounded border px-3 py-2"
      />

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as HubSortKey)}
        className="rounded border px-3 py-2"
      >
        <option value="views">Most Views</option>
        <option value="likes">Most Likes</option>
        <option value="shares">Most Shares</option>
        <option value="name">Name</option>
      </select>
    </div>
  );
}
