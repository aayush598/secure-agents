import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PROFILES, guardrailCatalog } from '@/modules/hub/data';
import { Eye, Heart, Share2, Shield, ArrowLeft, CheckCircle, Package, Tag } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { HubIcon } from '../../icon-map';

export default function ProfileDetailPage({ params }: { params: { slug: string } }) {
  const profile = PROFILES.find((p) => p.slug === params.slug);

  if (!profile) {
    notFound();
  }

  const guardrails = profile.guardrails
    .map((id) => guardrailCatalog.find((g) => g.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white bg-white/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Link href="/hub">
            <Button variant="ghost" size="sm" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Hub
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Profile Header Card */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 p-8">
            <div className="absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-white/5" />

            <div className="relative">
              <div className="mb-6 flex items-start gap-6">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                  <HubIcon name={profile.icon} className="h-20 w-20 text-white" />
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <Badge
                      className={`px-3 py-1 text-xs font-semibold ${
                        profile.stage === 'completed'
                          ? 'border-green-400/30 bg-green-500/20 text-green-300'
                          : profile.stage === 'development'
                            ? 'border-yellow-400/30 bg-yellow-500/20 text-yellow-300'
                            : 'border-blue-400/30 bg-blue-500/20 text-blue-300'
                      } `}
                    >
                      {profile.stage}
                    </Badge>
                    <Badge className="border-white/20 bg-white/10 text-white">
                      Security Profile
                    </Badge>
                  </div>

                  <h1 className="mb-3 text-4xl font-bold text-white">{profile.name}</h1>

                  <p className="max-w-3xl text-lg leading-relaxed text-slate-200">
                    {profile.description}
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="border-b border-slate-200 bg-slate-50/50">
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              <div className="px-6 py-5 text-center">
                <div className="mb-1 flex items-center justify-center gap-2 text-slate-600">
                  <Eye className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Views</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {profile.stats.views.toLocaleString()}
                </div>
              </div>

              <div className="px-6 py-5 text-center">
                <div className="mb-1 flex items-center justify-center gap-2 text-slate-600">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Likes</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {profile.stats.likes.toLocaleString()}
                </div>
              </div>

              <div className="px-6 py-5 text-center">
                <div className="mb-1 flex items-center justify-center gap-2 text-slate-600">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Shares</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {profile.stats.shares.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg hover:from-slate-800 hover:to-slate-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Use This Profile
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Heart className="mr-2 h-4 w-4" />
                Save to Favorites
              </Button>
              <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Included Guardrails Section */}
        <div className="mb-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-slate-900 p-2">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Included Guardrails</h2>
              <p className="text-sm text-slate-600">
                {guardrails.length} guardrails configured in this profile
              </p>
            </div>
          </div>

          {guardrails.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Package className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">No Guardrails Yet</h3>
              <p className="mx-auto max-w-md text-slate-600">
                No guardrails are finalized for this profile yet. Check back soon for updates.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guardrails.map((guardrail) => (
                <Link
                  key={guardrail!.id}
                  href={`/hub/guardrails/${guardrail!.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="rounded-xl bg-slate-100 p-3 transition-transform group-hover:scale-110">
                      <HubIcon name={guardrail!.icon} className="h-10 w-10 text-slate-700" />
                    </div>
                    <Badge
                      className={`text-xs font-semibold ${
                        guardrail!.stage === 'completed'
                          ? 'border-green-200 bg-green-100 text-green-700'
                          : guardrail!.stage === 'development'
                            ? 'border-yellow-200 bg-yellow-100 text-yellow-700'
                            : 'border-blue-200 bg-blue-100 text-blue-700'
                      } `}
                    >
                      {guardrail!.stage}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-slate-700">
                    {guardrail!.name}
                  </h3>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {guardrail!.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {guardrail!.stats.views.toLocaleString()}
                    </span>
                    <span className="text-slate-400">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <CheckCircle className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Benefits</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                <span>Pre-configured security rules for your use case</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                <span>Battle-tested in production environments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-slate-400">•</span>
                <span>Easy integration with existing applications</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-slate-100 p-2">
                <Tag className="h-5 w-5 text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900">Best For</h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              This profile is optimized for applications that require industry-specific compliance
              and security standards. Perfect for production deployments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
