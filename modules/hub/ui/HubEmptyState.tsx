export function HubEmptyState() {
  return (
    <div className="flex items-center justify-center py-24 text-center">
      <div className="max-w-md">
        <h3 className="text-lg font-semibold text-slate-900">No results found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Try adjusting your search or filters to find what you’re looking for.
        </p>
      </div>
    </div>
  );
}
