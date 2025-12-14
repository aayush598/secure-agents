'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import { 
  Shield, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalExecutions: number;
    totalPassed: number;
    totalFailed: number;
    avgExecutionTime: number;
    successRate: number;
    changeFromLastPeriod: {
      executions: number;
      successRate: number;
      avgTime: number;
    };
  };
  timeSeriesData: {
    date: string;
    executions: number;
    passed: number;
    failed: number;
    avgTime: number;
  }[];
  guardrailStats: {
    name: string;
    executions: number;
    failures: number;
    failureRate: number;
    avgExecutionTime: number;
  }[];
  profileStats: {
    name: string;
    executions: number;
    successRate: number;
  }[];
  hourlyDistribution: {
    hour: number;
    executions: number;
  }[];
  topErrors: {
    message: string;
    count: number;
    lastOccurred: string;
  }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?range=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

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
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/profiles">Profiles</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/dashboard/playground">Playground</Link>
                </Button>
                <Button variant="ghost" className="text-indigo-600 font-medium" asChild>
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Analytics & Insights
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Deep dive into your guardrails performance
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Executions
                </CardTitle>
                <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {formatNumber(analytics?.overview.totalExecutions || 0)}
              </div>
              {formatChange(analytics?.overview.changeFromLastPeriod.executions || 0)}
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Success Rate
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                {analytics?.overview.successRate.toFixed(1) || 0}%
              </div>
              {formatChange(analytics?.overview.changeFromLastPeriod.successRate || 0)}
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg Response Time
                </CardTitle>
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {analytics?.overview.avgExecutionTime || 0}ms
              </div>
              {formatChange(analytics?.overview.changeFromLastPeriod.avgTime || 0)}
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Failures
                </CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                {formatNumber(analytics?.overview.totalFailed || 0)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {((analytics?.overview.totalFailed || 0) / (analytics?.overview.totalExecutions || 1) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="guardrails">
              <Shield className="h-4 w-4 mr-2" />
              Guardrails
            </TabsTrigger>
            <TabsTrigger value="profiles">
              <PieChart className="h-4 w-4 mr-2" />
              Profiles
            </TabsTrigger>
            <TabsTrigger value="errors">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Top Errors
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Time Series Chart Placeholder */}
              <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Execution Trends</CardTitle>
                  <CardDescription>Daily execution statistics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-center text-slate-500 dark:text-slate-400">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Chart visualization placeholder</p>
                      <p className="text-xs mt-1">Integrate recharts or Chart.js for visualizations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Distribution */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Peak Usage Hours</CardTitle>
                  <CardDescription>Request distribution by hour</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.hourlyDistribution?.slice(0, 6).map((hour) => (
                      <div key={hour.hour} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {hour.hour}:00 - {hour.hour + 1}:00
                        </span>
                        <div className="flex items-center space-x-3 flex-1 mx-4">
                          <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(hour.executions / Math.max(...(analytics?.hourlyDistribution?.map(h => h.executions) || [1]))) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white w-16 text-right">
                            {formatNumber(hour.executions)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Success vs Failure */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle>Success vs Failure</CardTitle>
                  <CardDescription>Overall execution results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Passed</div>
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatNumber(analytics?.overview.totalPassed || 0)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="default" className="text-lg px-4 py-2">
                        {analytics?.overview.successRate.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                        <div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Failed</div>
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {formatNumber(analytics?.overview.totalFailed || 0)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-lg px-4 py-2">
                        {(100 - (analytics?.overview.successRate || 0)).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Guardrails Tab */}
          <TabsContent value="guardrails" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Guardrail Performance</CardTitle>
                <CardDescription>Execution statistics by guardrail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.guardrailStats?.map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {stat.name}
                          </span>
                          <Badge variant={stat.failureRate > 10 ? 'destructive' : 'default'}>
                            {stat.failureRate.toFixed(1)}% fail rate
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Executions: </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatNumber(stat.executions)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Failures: </span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {formatNumber(stat.failures)}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600 dark:text-slate-400">Avg Time: </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {stat.avgExecutionTime}ms
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics?.profileStats?.map((profile, idx) => (
                <Card key={idx} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Executions</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatNumber(profile.executions)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Success Rate</span>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                          {profile.successRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${profile.successRate}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle>Most Common Errors</CardTitle>
                <CardDescription>Frequently occurring validation failures</CardDescription>
              </CardHeader>
              <CardContent>
                {!analytics?.topErrors || analytics.topErrors.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No errors detected</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.topErrors.map((error, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="destructive">{error.count} occurrences</Badge>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Last: {new Date(error.lastOccurred).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-900 dark:text-white">{error.message}</p>
                        </div>
                      </div>
                    ))}
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