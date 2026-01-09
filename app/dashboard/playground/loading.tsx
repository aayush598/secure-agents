import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i} className="border-slate-200">
          <CardContent className="p-6 space-y-4">
            <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse" />
            <div className="h-40 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
