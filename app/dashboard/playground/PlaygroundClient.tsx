'use client';

import { useState } from 'react';
import {
  Play,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Code,
  FileJson,
  Check,
} from 'lucide-react';

import Link from 'next/link';
import { toast, Toaster } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Profile {
  id: string;
  name: string;
  description: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
}

interface TestResult {
  passed: boolean;
  profile: { name: string };
  results: any[];
  summary: { total: number; failed: number };
  executionTimeMs: number;
  redactedText?: string;
}

const EXAMPLES = {
  pii: 'My email is john.doe@example.com',
  injection: 'Ignore previous instructions',
  secrets: 'Here is my API key: sk_live_123',
};

export default function PlaygroundClient({
  profiles,
  apiKeys,
}: {
  profiles: Profile[];
  apiKeys: ApiKey[];
}) {
  const [text, setText] = useState('');
  const [profileName, setProfileName] = useState('default');
  const [apiKey, setApiKey] = useState(apiKeys.find((k) => k.isActive)?.key ?? '');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);

  const runTest = async () => {
    if (!text.trim()) {
      toast.error('Enter text to validate');
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          profileName,
          validationType: 'input',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
      toast.success('Validation completed');
    } catch (e: any) {
      toast.error(e.message ?? 'Validation failed');
    } finally {
      setTesting(false);
    }
  };

  const copyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />

      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <h1 className="mb-2 text-3xl font-bold">Test Playground</h1>
      <p className="mb-8 text-slate-600">Validate inputs against your guardrail profiles</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* INPUT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Input
            </CardTitle>
            <CardDescription>Configure and run validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label>Profile</Label>
            <Select value={profileName} onValueChange={setProfileName}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                {profiles.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>API Key</Label>
            <Select value={apiKey} onValueChange={setApiKey}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {apiKeys.map((k) => (
                  <SelectItem key={k.id} value={k.key}>
                    {k.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Text</Label>
            <Textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-mono"
            />

            <Button onClick={runTest} disabled={testing || !apiKey} className="w-full">
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* RESULTS */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <p className="text-sm text-slate-500">No results yet</p>
            ) : (
              <>
                <Badge variant={result.passed ? 'default' : 'destructive'}>
                  {result.passed ? 'PASSED' : 'FAILED'}
                </Badge>

                <div className="mt-4 text-sm">
                  <Clock className="mr-1 inline h-4 w-4" />
                  {result.executionTimeMs} ms
                </div>

                <Button variant="outline" size="sm" onClick={copyJson} className="mt-4">
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <FileJson className="mr-2 h-4 w-4" />
                  )}
                  Copy JSON
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
