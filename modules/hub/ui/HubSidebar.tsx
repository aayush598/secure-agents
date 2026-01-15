import { HUB_TAGS, HubTag } from '@/modules/hub/domain/hub-tags';
import { Database, ShieldCheck, LayoutGrid } from 'lucide-react';
import { Button } from '@/shared/ui/button';

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
    <aside className="hidden w-72 shrink-0 space-y-8 lg:block">
      {/* Header Section */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Filters
        </h3>
        {selectedTags.length > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] font-bold uppercase text-indigo-600 transition-colors hover:text-indigo-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Tag Grid */}
      <div className="flex flex-wrap gap-x-3 gap-y-3">
        {HUB_TAGS.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <div className="px-2 py-1" key={tag}>
              <Button
                key={tag}
                onClick={() => onToggleTag(tag)}
                // Added ! modifiers to ensure background and text color override any global button styles
                className={`group flex items-center gap-2 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? '!border-indigo-600 !bg-indigo-600 !text-white shadow-lg shadow-indigo-100 ring-2 ring-indigo-600 ring-offset-1'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                } `}
              >
                <span>{tag}</span>
              </Button>
            </div>
          );
        })}
      </div>

      <div className="h-px bg-slate-100" />

      {/* Stats Section - High Contrast Table Layout */}
      <div className="space-y-4 px-1">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
          Analytics
        </h3>

        <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Total Row */}
          <div className="flex items-center justify-between p-3.5 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <LayoutGrid size={16} className="text-slate-400" />
              <span className="text-[13px] font-medium text-slate-600">Total Items</span>
            </div>
            <span className="text-sm font-bold tabular-nums text-slate-900">
              {stats.total.toLocaleString()}
            </span>
          </div>

          {/* Guardrails Row */}
          <div className="flex items-center justify-between p-3.5 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-indigo-500" />
              <span className="text-[13px] font-medium text-slate-600">Guardrails</span>
            </div>
            <span className="text-sm font-bold tabular-nums text-slate-900">
              {stats.guardrails}
            </span>
          </div>

          {/* Profiles Row */}
          <div className="flex items-center justify-between p-3.5 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <Database size={16} className="text-emerald-500" />
              <span className="text-[13px] font-medium text-slate-600">Profiles</span>
            </div>
            <span className="text-sm font-bold tabular-nums text-slate-900">{stats.profiles}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
