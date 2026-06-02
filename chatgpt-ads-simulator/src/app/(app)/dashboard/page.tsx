"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MetricCard } from "@/components/performance/MetricCard";
import { PerformanceChart } from "@/components/performance/PerformanceChart";
import { TopNav } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_DASHBOARD_METRICS, loadPrebakedPerformance } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import type { PerformanceData } from "@/lib/types";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function DashboardPage() {
  const campaigns = useAppStore((s) => s.campaigns);
  const activeCampaign =
    campaigns.find((c) => c.status === "active") ?? campaigns[0];
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void loadPrebakedPerformance()
      .then((data) => {
        if (!cancelled) setPerformance(data);
      })
      .catch(() => {
        if (!cancelled) setPerformance(null);
      })
      .finally(() => {
        if (!cancelled) setPerformanceLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <TopNav title="Dashboard" />
      <div className="space-y-6 p-6">
        <PerformanceChart
          data={performance}
          loading={performanceLoading}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total spend (30d)"
            value={formatCurrency(DEMO_DASHBOARD_METRICS.totalSpend30d)}
          />
          <MetricCard
            label="Total clicks (30d)"
            value={DEMO_DASHBOARD_METRICS.totalClicks30d.toLocaleString()}
          />
          <MetricCard
            label="Average CTR"
            value={`${DEMO_DASHBOARD_METRICS.avgCtr}%`}
          />
          <MetricCard
            label="Conversions"
            value={String(DEMO_DASHBOARD_METRICS.conversions30d)}
          />
        </div>

        {activeCampaign && (
          <div className="surface flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-zinc-500">Active campaign</p>
              <p className="mt-1 font-semibold text-zinc-900">
                {activeCampaign.name}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/campaigns/${activeCampaign.id}`}>
                <Button variant="outline">View campaign</Button>
              </Link>
              {(activeCampaign.status === "draft" ||
                activeCampaign.status === "simulated") && (
                <Link href={`/campaigns/${activeCampaign.id}/simulate`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Simulate
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="surface overflow-hidden">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-900">Campaigns</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs text-zinc-500">
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Budget</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-zinc-100">
                  <td className="px-5 py-3">
                    <Link
                      href={`/campaigns/${c.id}`}
                      className="font-medium text-zinc-900 hover:text-emerald-600"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3 tabular-nums text-zinc-600">
                    ${c.draft.campaign.daily_budget_usd}/day
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-zinc-500">
                    No campaigns yet.{" "}
                    <Link href="/campaigns/new" className="text-emerald-600">
                      Create one
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending_review: "bg-amber-50 text-amber-700 border-amber-200",
    draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
    simulated: "bg-blue-50 text-blue-700 border-blue-200",
    paused: "bg-zinc-100 text-zinc-500 border-zinc-200",
  };
  const label = status.replace("_", " ");
  return (
    <Badge
      variant="outline"
      className={variants[status] ?? variants.draft}
    >
      {label}
    </Badge>
  );
}
