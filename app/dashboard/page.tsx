'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { Shield, Key, FileCode, BarChart3, Plus, Copy, Check, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  requestsPerMinute: number;
  requestsPerDay: number;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
}

interface Profile {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  inputGuardrails: any[];
  outputGuardrails: any[];
  toolGuardrails: any[];
}

interface UsageStats {
  totalExecutions: number;
  last24Hours: number;
  passedExecutions: number;
  failedExecutions: number;
  rateLimits: {
    perMinute: { current: number; max: number };
    perDay: { current: number; max: number };
  };
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // New API Key Dialog
  const [newKeyOpen, setNewKeyOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  
  // New Profile Dialog
  const [newProfileOpen, setNewProfileOpen] = useState(false);
  const [newProfileData, setNewProfileData] = useState({
    name: '',
    description: '',
    inputGuardrails: [],
    outputGuardrails: [],
  });

  // Test Playground
  const [testText, setTestText] = useState('');
  const [testProfile, setTestProfile] = useState('');
  const [testType, setTestType] = useState('input');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [keysRes, profilesRes, usageRes] = await Promise.all([
        fetch('/api/keys'),
        fetch('/api/profiles'),
        fetch('/api/usage'),
      ]);

      const keysData = await keysRes.json();
      const profilesData = await profilesRes.json();
      const usageData = await usageRes.json();

      setApiKeys(keysData.apiKeys || []);
      setProfiles(profilesData.profiles || []);
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    console.log('createApiKey')
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!res.ok) throw new Error('Failed to create API key');

      const data = await res.json();
      setApiKeys([data.apiKey, ...apiKeys]);
      setNewKeyOpen(false);
      setNewKeyName('');
      toast.success('API key created successfully!');
    } catch (error) {
      toast.error('Failed to create API key');
    }
  };

  const deleteApiKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete API key');

      setApiKeys(apiKeys.filter((k) => k.id !== id));
      toast.success('API key deactivated');
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

  const testGuardrails = async () => {
    if (!testText.trim()) {
      toast.error('Please enter text to validate');
      return;
    }

    if (apiKeys.length === 0) {
      toast.error('Please create an API key first');
      return;
    }

    setTesting(true);
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKeys[0].key,
        },
        body: JSON.stringify({
          text: testText,
          profileId: testProfile || undefined,
          validationType: testType,
        }),
      });

      const data = await res.json();
      setTestResult(data);
      
      if (data.passed) {
        toast.success('All guardrails passed!');
      } else {
        toast.warning('Some guardrails failed');
      }
    } catch (error) {
      toast.error('Failed to test guardrails');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />

      <Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New API Key</DialogTitle>
      <DialogDescription>
        Give your API key a memorable name
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="api-key-name">Key Name</Label>
        <Input
          id="api-key-name"
          name="api-key-name"
          autoComplete="off"
          placeholder="Production Key"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
        />
      </div>
    </div>

    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button
        onClick={createApiKey}
        className="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Create Key
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-slate-900">Guardrails Dashboard</h1>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Executions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{usage?.totalExecutions || 0}</div>
              <p className="text-xs text-slate-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Last 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-600">{usage?.last24Hours || 0}</div>
              <p className="text-xs text-slate-500 mt-1">Recent activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {usage?.totalExecutions
                  ? Math.round((usage.passedExecutions / usage.totalExecutions) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {usage?.passedExecutions || 0} passed / {usage?.failedExecutions || 0} failed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Rate Limit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {usage?.rateLimits.perDay.current || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                of {usage?.rateLimits.perDay.max.toLocaleString()} today
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="profiles">
              <FileCode className="h-4 w-4 mr-2" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="playground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Playground
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">API Keys</h2>
                <p className="text-slate-600">Manage your API keys and rate limits</p>
              </div>
              <Dialog open={newKeyOpen} onOpenChange={setNewKeyOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create API Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>Give your API key a memorable name</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Key Name</Label>
                      <Input
                        id="name"
                        placeholder="Production Key"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewKeyOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createApiKey} className="bg-indigo-600 text-white hover:bg-indigo-700">
                      Create Key
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {apiKeys.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No API Keys</AlertTitle>
                <AlertDescription>
                  Create your first API key to start using the guardrails service.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <Card key={key.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{key.name}</h3>
                            <Badge variant={key.isActive ? 'default' : 'secondary'}>
                              {key.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="bg-slate-100 px-3 py-1 rounded text-sm font-mono">
                              {key.key}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(key.key, key.id)}
                            >
                              {copiedKey === key.id ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteApiKey(key.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Per Minute:</span>
                          <span className="font-semibold ml-2">{key.requestsPerMinute}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Per Day:</span>
                          <span className="font-semibold ml-2">{key.requestsPerDay.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Guardrail Profiles</h2>
                <p className="text-slate-600">Built-in and custom security profiles</p>
              </div>
            </div>

            <div className="space-y-4">
              {profiles.map((profile) => (
                <Card key={profile.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle>{profile.name}</CardTitle>
                          {profile.isBuiltIn && (
                            <Badge variant="secondary">Built-in</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {profile.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Input Guardrails:</span>
                        <span className="font-semibold ml-2">
                          {profile.inputGuardrails?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Output Guardrails:</span>
                        <span className="font-semibold ml-2">
                          {profile.outputGuardrails?.length || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600">Tool Guardrails:</span>
                        <span className="font-semibold ml-2">
                          {profile.toolGuardrails?.length || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Playground Tab */}
          <TabsContent value="playground" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Test Playground</h2>
              <p className="text-slate-600">Test your guardrails in real-time</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profile</Label>
                    <Select value={testProfile} onValueChange={setTestProfile}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select profile (default if empty)" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Validation Type</Label>
                    <Select value={testType} onValueChange={setTestType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="input">Input</SelectItem>
                        <SelectItem value="output">Output</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Test Text</Label>
                  <Textarea
                    placeholder="Enter text to validate..."
                    rows={6}
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                  />
                </div>

                <Button
                  onClick={testGuardrails}
                  disabled={testing}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {testing ? 'Testing...' : 'Run Guardrails'}
                </Button>

                {testResult && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge
                          className="ml-2"
                          variant={testResult.passed ? 'default' : 'destructive'}
                        >
                          {testResult.passed ? 'Passed' : 'Failed'}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {testResult.executionTimeMs}ms
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Results:</h4>
                      <div className="space-y-2">
                        {testResult.results.map((result: any, i: number) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border-2 ${
                              result.passed
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{result.guardrailName}</div>
                                <div className="text-sm mt-1">{result.message}</div>
                              </div>
                              <Badge variant={result.passed ? 'default' : 'destructive'}>
                                {result.severity}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {testResult.redactedText && (
                      <div>
                        <h4 className="font-semibold mb-2">Redacted Output:</h4>
                        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                          {testResult.redactedText}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}