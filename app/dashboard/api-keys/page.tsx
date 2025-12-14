'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Shield, Key, Plus, Copy, Check, Trash2, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  requestsPerMinute: number;
  requestsPerDay: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  usageToday: number;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyOpen, setNewKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const res = await fetch('/api/keys');
      if (!res.ok) throw new Error('Failed to fetch API keys');
      const data = await res.json();
      setApiKeys(data.apiKeys || []);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setCreatingKey(true);
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create API key');
      }

      const data = await res.json();
      setApiKeys([data.apiKey, ...apiKeys]);
      setNewKeyOpen(false);
      setNewKeyName('');
      toast.success('API key created successfully!');
      
      // Auto-copy new key to clipboard
      navigator.clipboard.writeText(data.apiKey.key);
      setCopiedKey(data.apiKey.id);
      setTimeout(() => setCopiedKey(null), 3000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const deleteApiKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete API key');

      setApiKeys(apiKeys.filter((k) => k.id !== id));
      toast.success('API key deactivated successfully');
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    toast.success('Copied to clipboard!');
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '•'.repeat(20) + key.substring(key.length - 8);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Key className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading API keys...</p>
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
                <Button variant="ghost" className="text-indigo-600 font-medium" asChild>
                  <Link href="/dashboard/api-keys">API Keys</Link>
                </Button>
                <Button variant="ghost" asChild>
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
              API Keys
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your API keys and access tokens
            </p>
          </div>
          <Dialog open={newKeyOpen} onOpenChange={setNewKeyOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>
                  Give your API key a memorable name to identify it later
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Key Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Production API, Development Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !creatingKey) {
                        createApiKey();
                      }
                    }}
                  />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription className="text-xs">
                    Your API key will be shown only once. Make sure to copy it immediately.
                  </AlertDescription>
                </Alert>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setNewKeyOpen(false)}
                  disabled={creatingKey}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createApiKey}
                  disabled={creatingKey}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {creatingKey ? 'Creating...' : 'Create Key'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* API Keys List */}
        {apiKeys.length === 0 ? (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="py-16">
              <div className="text-center">
                <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No API Keys Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                  Create your first API key to start using the guardrails service in your applications
                </p>
                <Button
                  onClick={() => setNewKeyOpen(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => {
              const isVisible = visibleKeys.has(key.id);
              const usagePercentage = (key.usageToday / key.requestsPerDay) * 100;
              
              return (
                <Card
                  key={key.id}
                  className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-xl">{key.name}</CardTitle>
                          <Badge variant={key.isActive ? 'default' : 'secondary'}>
                            {key.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          Created {new Date(key.createdAt).toLocaleDateString()} • 
                          {key.lastUsedAt 
                            ? ` Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                            : ' Never used'}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteApiKey(key.id, key.name)}
                        className="ml-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* API Key Display */}
                    <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                      <code className="flex-1 text-sm font-mono text-slate-900 dark:text-slate-100 break-all">
                        {isVisible ? key.key : maskKey(key.key)}
                      </code>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="h-8 w-8 p-0"
                        >
                          {isVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(key.key, key.id)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedKey === key.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                          Rate Limit (per min)
                        </div>
                        <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                          {key.requestsPerMinute}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                          Daily Limit
                        </div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                          {key.requestsPerDay.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                          Used Today
                        </div>
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          {
                                (key.usageToday ?? 0).toLocaleString()
                            }
                        </div>
                      </div>
                    </div>

                    {/* Daily Usage Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Daily Usage
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {usagePercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            usagePercentage > 90
                              ? 'bg-gradient-to-r from-red-600 to-red-500'
                              : usagePercentage > 70
                              ? 'bg-gradient-to-r from-amber-600 to-amber-500'
                              : 'bg-gradient-to-r from-green-600 to-green-500'
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <span>API Key Best Practices</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>• Store API keys securely in environment variables, never in your codebase</p>
            <p>• Rotate keys regularly and revoke unused keys immediately</p>
            <p>• Use different keys for development, staging, and production environments</p>
            <p>• Monitor usage patterns to detect unauthorized access</p>
            <p>• Set appropriate rate limits based on your application needs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}