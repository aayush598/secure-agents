'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Shield, FileCode, Plus, ArrowLeft, Lock, Zap, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

interface Guardrail {
  class: string;
  config: Record<string, any>;
}

interface Profile {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  inputGuardrails: Guardrail[];
  outputGuardrails: Guardrail[];
  toolGuardrails: Guardrail[];
  createdAt: string;
  usageCount?: number;
}

const PROFILE_ICONS: Record<string, string> = {
  default: '🛡️',
  'enterprise-security': '🏢',
  'enterprise_security': '🏢',
  'child-safety': '👶',
  'child_safety': '👶',
  healthcare: '🏥',
  financial: '💰',
  minimal: '🔧',
};

const PROFILE_COLORS: Record<string, string> = {
  default: 'from-indigo-500 to-indigo-600',
  'enterprise-security': 'from-purple-500 to-purple-600',
  'enterprise_security': 'from-purple-500 to-purple-600',
  'child-safety': 'from-pink-500 to-pink-600',
  'child_safety': 'from-pink-500 to-pink-600',
  healthcare: 'from-green-500 to-green-600',
  financial: 'from-yellow-500 to-yellow-600',
  minimal: 'from-slate-500 to-slate-600',
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/profiles');
      if (!res.ok) throw new Error('Failed to fetch profiles');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const getProfileIcon = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    return PROFILE_ICONS[key] || '📋';
  };

  const getProfileColor = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '-');
    return PROFILE_COLORS[key] || 'from-slate-500 to-slate-600';
  };

  const getTotalGuardrails = (profile: Profile) => {
    return (
      (profile.inputGuardrails?.length || 0) +
      (profile.outputGuardrails?.length || 0) +
      (profile.toolGuardrails?.length || 0)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FileCode className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Toaster />

      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Secure Agents
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Overview</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/api-keys">API Keys</Link>
                </Button>
                <Button variant="ghost" className="text-indigo-600 font-medium" asChild>
                  <Link href="/dashboard/profiles">Profiles</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/playground">Playground</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/analytics">Analytics</Link>
                </Button>
              </nav>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button & Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" asChild className="group">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Guardrail Profiles
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Pre-built and custom security configurations for your applications
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            onClick={() => toast.info('Custom profile builder coming soon!')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Profile
          </Button>
        </div>

        {/* Profiles Grid */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="all">All Profiles ({profiles.length})</TabsTrigger>
            <TabsTrigger value="built-in">
              Built-in ({profiles.filter(p => p.isBuiltIn).length})
            </TabsTrigger>
            <TabsTrigger value="custom">
              Custom ({profiles.filter(p => !p.isBuiltIn).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <Card
                  key={profile.id}
                  className="group border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getProfileColor(profile.name)} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {getProfileIcon(profile.name)}
                      </div>
                      {profile.isBuiltIn && (
                        <Badge variant="secondary" className="mt-2">
                          Built-in
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg text-center">
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                          {profile.inputGuardrails?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Input</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg text-center">
                        <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                          {profile.outputGuardrails?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Output</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-center">
                        <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                          {profile.toolGuardrails?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Tool</div>
                      </div>
                    </div>

                    {profile.usageCount !== undefined && (
                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span>Usage Count</span>
                        <span className="font-semibold">{profile.usageCount.toLocaleString()}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="built-in" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.filter(p => p.isBuiltIn).map((profile) => (
                <Card
                  key={profile.id}
                  className="group border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProfile(profile)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getProfileColor(profile.name)} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {getProfileIcon(profile.name)}
                      </div>
                      <Badge variant="secondary" className="mt-2">Built-in</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {profile.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg text-center">
                        <div className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                          {profile.inputGuardrails?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Input</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg text-center">
                        <div className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                          {profile.outputGuardrails?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Output</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg text-center">
                        <div className="font-bold text-green-600 dark:text-green-400 text-lg">
                          {profile.toolGuardrails?.length || 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Tool</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            {profiles.filter(p => !p.isBuiltIn).length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-800">
                <CardContent className="py-16">
                  <div className="text-center">
                    <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileCode className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      No Custom Profiles
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      Create custom guardrail profiles tailored to your specific security needs
                    </p>
                    <Button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      onClick={() => toast.info('Custom profile builder coming soon!')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Custom Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.filter(p => !p.isBuiltIn).map((profile) => (
                  <Card
                    key={profile.id}
                    className="group border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  >
                    {/* Custom profile rendering */}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <CardTitle className="text-lg">Input Guardrails</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Validate and sanitize data before it reaches your LLM. Detect PII, secrets, and malicious patterns.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle className="text-lg">Output Guardrails</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Redact sensitive information from LLM responses. Prevent data leaks and ensure compliance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-lg">Tool Guardrails</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Control which tools and APIs your LLM can access. Prevent destructive operations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profile Detail Modal (simplified for now) */}
      {selectedProfile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProfile(null)}
        >
          <Card
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getProfileColor(selectedProfile.name)} flex items-center justify-center text-3xl shadow-lg`}>
                  {getProfileIcon(selectedProfile.name)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{selectedProfile.name}</CardTitle>
                  <CardDescription>{selectedProfile.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guardrails Breakdown */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Lock className="h-4 w-4 text-indigo-600" />
                  <span>Input Guardrails ({selectedProfile.inputGuardrails?.length || 0})</span>
                </h3>
                <div className="space-y-2">
                  {selectedProfile.inputGuardrails?.map((g, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <code className="text-sm text-indigo-600 dark:text-indigo-400">{g.class}</code>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>Output Guardrails ({selectedProfile.outputGuardrails?.length || 0})</span>
                </h3>
                <div className="space-y-2">
                  {selectedProfile.outputGuardrails?.map((g, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <code className="text-sm text-purple-600 dark:text-purple-400">{g.class}</code>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => setSelectedProfile(null)}
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}