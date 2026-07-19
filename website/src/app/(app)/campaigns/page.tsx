"use client";

import Link from "next/link";

import { TopNav } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export default function CampaignsPage() {
  const campaigns = useAppStore((s) => s.campaigns);

  return (
    <>
      <TopNav
        title="Campaigns"
        actions={
          <Link href="/campaigns/new">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              New campaign
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        <div className="space-y-3">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="surface flex items-center justify-between p-5 transition-colors hover:border-emerald-200"
            >
              <div>
                <p className="font-medium text-zinc-900">{c.name}</p>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {c.draft.ad_groups.length} ad groups · $
                  {c.draft.campaign.daily_budget_usd}/day
                </p>
              </div>
              <Badge variant="outline">{c.status.replace("_", " ")}</Badge>
            </Link>
          ))}
          {campaigns.length === 0 && (
            <div className="surface p-12 text-center">
              <p className="text-zinc-600">No campaigns yet</p>
              <Link href="/campaigns/new">
                <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                  Create your first campaign
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
