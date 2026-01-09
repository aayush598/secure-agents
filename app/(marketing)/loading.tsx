export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Decorative blobs (match landing page) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Page skeleton */}
      <div className="relative">
        <HeroSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}

/* ---------- Skeleton Components ---------- */

function HeroSkeleton() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-14 w-5/6" />
          <Skeleton className="h-6 w-4/5" />

          <div className="flex gap-4 pt-4">
            <Skeleton className="h-14 w-44 rounded-xl" />
            <Skeleton className="h-14 w-44 rounded-xl" />
          </div>
        </div>

        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 space-y-4">
          <Skeleton className="h-6 w-40 mx-auto rounded-full" />
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
      animate-pulse ${className}`}
    />
  );
}
