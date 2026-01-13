import { HUB_TAGS, HubTag } from '@/modules/hub/domain/hub-tags';
import { Badge } from '@/shared/ui/badge';

export function HubSidebar({
  selectedTags,
  onToggleTag,
  onClear,
  stats,
}: {
  selectedTags: HubTag[];
  onToggleTag: (tag: HubTag) => void;
  onClear: () => void;
  stats: { total: number; guardrails: number; profiles: number };
}) {
  return (
    <aside className="hidden w-72 space-y-6 lg:block">
      <div className="rounded-xl border bg-white p-6">
        <h3 className="mb-3 font-semibold">Filters</h3>

        {selectedTags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} onClick={() => onToggleTag(tag)}>
                #{tag}
              </Badge>
            ))}
            <button onClick={onClear} className="text-xs text-slate-500">
              Clear
            </button>
          </div>
        )}

        <div className="space-y-2">
          {HUB_TAGS.map((tag) => (
            <button key={tag} onClick={() => onToggleTag(tag)} className="w-full text-left text-sm">
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-slate-100 p-6">
        <p>Total: {stats.total}</p>
        <p>Guardrails: {stats.guardrails}</p>
        <p>Profiles: {stats.profiles}</p>
      </div>
    </aside>
  );
}
