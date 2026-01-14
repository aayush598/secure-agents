'use client';

import { useState } from 'react';
import { Play, Loader2, FileJson, Check, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { validateText } from './playground.service';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Badge } from '@/shared/ui/badge';
import type { ValidateResponse } from '@/modules/guardrails/contracts/validate';

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

type ValidationType = 'input' | 'output' | 'both';

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
  const [validationType, setValidationType] = useState<ValidationType>('input');
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<ValidateResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const runTest = async () => {
    if (!text.trim()) {
      toast.error('Enter text to validate');
      return;
    }

    setTesting(true);
    setResult(null);

    try {
      const res = await validateText({ text, profileName, validationType }, apiKey);
      setResult(res);
      toast.success('Validation completed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Validation failed');
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

  const failed = result?.results.filter((r) => !r.passed) ?? [];
  const passed = result?.results.filter((r) => r.passed) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster />
      <h1 className="mb-6 text-3xl font-bold">Playground</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CONFIGURATION */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Configuration</CardTitle>
            <CardDescription>Configure profile, validation scope, and input text</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Label>Validation Type</Label>
            <Select
              value={validationType}
              onValueChange={(v) => setValidationType(v as ValidationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="input">Input only</SelectItem>
                <SelectItem value="output">Output only</SelectItem>
                <SelectItem value="both">Input + Output</SelectItem>
              </SelectContent>
            </Select>

            <Label>Profile</Label>
            <Select value={profileName} onValueChange={setProfileName}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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

            <Label>
              {validationType === 'output'
                ? 'Output text'
                : validationType === 'both'
                  ? 'Input / Output text'
                  : 'Input text'}
            </Label>

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
                  Running
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Validation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* RESULTS */}
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
            <CardDescription>Guardrail execution details and outcomes</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {!result ? (
              <p className="text-sm text-slate-500">No results yet</p>
            ) : (
              <>
                {/* SUMMARY */}
                <div className="flex items-center justify-between">
                  <Badge variant={result.passed ? 'default' : 'destructive'}>
                    {result.passed ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        PASSED
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        FAILED
                      </>
                    )}
                  </Badge>

                  <span className="text-xs text-slate-500">{result.executionTimeMs} ms</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Profile</span>
                    <div className="font-medium">{result.profile.name}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Validation Type</span>
                    <div className="font-medium capitalize">{result.validationType}</div>
                  </div>
                </div>

                {/* FAILED */}
                {failed.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-red-600">
                      Failed Guardrails ({failed.length})
                    </h3>

                    {failed.map((r, i) => (
                      <div key={i} className="rounded-md border border-red-200 bg-red-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-medium">{r.guardrailName}</span>
                          {r.severity && (
                            <Badge variant="destructive" className="text-xs">
                              {r.severity}
                            </Badge>
                          )}
                        </div>

                        {r.message && <p className="mt-1 text-sm text-slate-700">{r.message}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* PASSED */}
                {passed.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-600">
                      Passed Guardrails ({passed.length})
                    </h3>

                    {passed.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-md border p-2 text-sm"
                      >
                        <span className="font-mono">{r.guardrailName}</span>
                        <Badge variant="outline" className="text-xs">
                          Passed
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {/* RAW JSON */}
                <details className="pt-2">
                  <summary className="cursor-pointer text-sm text-slate-600">View raw JSON</summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>

                <Button variant="outline" size="sm" onClick={copyJson}>
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
