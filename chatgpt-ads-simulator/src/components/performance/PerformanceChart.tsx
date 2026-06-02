"use client";

import { useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PerformanceData } from "@/lib/types";
import { cn } from "@/lib/utils";

type ChartMetric = "spend" | "clicks";

interface PerformanceChartProps {
  data: PerformanceData | null;
  loading?: boolean;
  className?: string;
}

function aggregateByDate(data: PerformanceData) {
  const byDate = new Map<
    string,
    { date: string; spend_usd: number; actual_clicks: number; actual_impressions: number }
  >();

  for (const row of data.daily) {
    const existing = byDate.get(row.date) ?? {
      date: row.date,
      spend_usd: 0,
      actual_clicks: 0,
      actual_impressions: 0,
    };
    existing.spend_usd += row.spend_usd;
    existing.actual_clicks += row.actual_clicks;
    existing.actual_impressions += row.actual_impressions;
    byDate.set(row.date, existing);
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function formatDateLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PerformanceChart({
  data,
  loading = false,
  className,
}: PerformanceChartProps) {
  const [metric, setMetric] = useState<ChartMetric>("spend");
  const gradientId = `perf-${useId().replace(/:/g, "")}`;

  const chartData = useMemo(() => {
    if (!data) return [];
    return aggregateByDate(data).map((row) => ({
      ...row,
      label: formatDateLabel(row.date),
      value: metric === "spend" ? row.spend_usd : row.actual_clicks,
    }));
  }, [data, metric]);

  const valueKey = "value";
  const strokeColor = metric === "spend" ? "#059669" : "#10b981";
  const label = metric === "spend" ? "Daily spend" : "Daily clicks";

  return (
    <div className={cn("surface p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="label-mono">30-day performance</p>
          <h2 className="mt-1 text-sm font-semibold text-zinc-900">
            Campaign spend trend
          </h2>
        </div>
        <div className="flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMetric("spend")}
            className={cn(
              "rounded px-3 py-1.5 font-medium transition-colors",
              metric === "spend"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            Spend
          </button>
          <button
            type="button"
            onClick={() => setMetric("clicks")}
            className={cn(
              "rounded px-3 py-1.5 font-medium transition-colors",
              metric === "clicks"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700",
            )}
          >
            Clicks
          </button>
        </div>
      </div>

      <div className="mt-4 h-56 w-full">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Loading chart…
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No performance data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={{ stroke: "#e4e4e7" }}
                interval="preserveStartEnd"
                minTickGap={32}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                width={metric === "spend" ? 52 : 40}
                tickFormatter={(v: number) =>
                  metric === "spend" ? `$${Math.round(v)}` : String(Math.round(v))
                }
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e4e4e7",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload as { date?: string } | undefined;
                  return row?.date ? formatDateLabel(row.date) : "";
                }}
                formatter={(value) => {
                  const n = typeof value === "number" ? value : Number(value ?? 0);
                  return [
                    metric === "spend" ? formatCurrency(n) : n.toLocaleString(),
                    label,
                  ];
                }}
              />
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke={strokeColor}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
