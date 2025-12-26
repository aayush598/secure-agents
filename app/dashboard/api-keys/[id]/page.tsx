"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#0f172a", "#cbd5e1"];

export default function ApiKeyAnalyticsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/usage/keys/${params.id}`)
      .then(r => r.json())
      .then(setData);
  }, [params.id]);

  if (!data) {
    return <div className="p-8 text-slate-600">Loading analytics…</div>;
  }

  return (
    <div className="p-8 space-y-10 bg-slate-50 min-h-screen">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">API Key Analytics</h1>
        <p className="text-sm text-slate-600">
          Detailed usage and performance metrics
        </p>
      </header>

      {/* REQUESTS */}
      <Section title="Traffic">
        <Chart title="Requests per Minute (Last 60 min)">
          <LineChart data={data.perMinute}>
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#0f172a" strokeWidth={2} />
          </LineChart>
        </Chart>

        <Chart title="Requests per Hour (Last 24h)">
          <LineChart data={data.perHour}>
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" stroke="#0f172a" strokeWidth={2} />
          </LineChart>
        </Chart>

        <Chart title="Requests per Day (Last 7d)">
          <BarChart data={data.perDay}>
            <XAxis dataKey="time" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0f172a" />
          </BarChart>
        </Chart>
      </Section>

      {/* RELIABILITY */}
      <Section title="Reliability">
        <Chart title="Success vs Failure (24h)">
          <BarChart
            data={data.successFailure.map((x: any) => ({
              name: x.passed ? "Success" : "Failure",
              value: x.count,
            }))}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.successFailure.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </Chart>
      </Section>

      {/* LATENCY */}
      <Section title="Latency">
        <div className="grid grid-cols-3 gap-6">
          <Metric label="P50" value={`${data.latency.p50} ms`} />
          <Metric label="P95" value={`${data.latency.p95} ms`} />
          <Metric label="P99" value={`${data.latency.p99} ms`} />
        </div>
      </Section>
    </div>
  );
}

/* ---------- UI PRIMITIVES ---------- */

function Section({ title, children }: any) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="grid md:grid-cols-2 gap-6">{children}</div>
    </section>
  );
}

function Chart({ title, children }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-sm font-medium text-slate-700 mb-2">{title}</div>
      <ResponsiveContainer width="100%" height={260}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
