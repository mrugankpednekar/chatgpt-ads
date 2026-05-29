"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { CampaignDraftEditor } from "@/components/campaign/CampaignDraftEditor";
import { LaunchModal } from "@/components/campaign/LaunchModal";
import { TopNav } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const campaign = useAppStore((s) => s.getCampaign(id));
  const setCampaignDraft = useAppStore((s) => s.setCampaignDraft);
  const [showLaunch, setShowLaunch] = useState(false);

  if (!campaign) {
    return <div className="p-6 text-sm text-zinc-500">Campaign not found</div>;
  }

  const canSimulate =
    campaign.status === "draft" || campaign.status === "simulated";
  const canLaunch = campaign.status === "simulated";
  const canEditDraft =
    campaign.status === "draft" || campaign.status === "simulated";

  return (
    <>
      <TopNav
        title={campaign.name}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={campaign.status} />
            {canLaunch && (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setShowLaunch(true)}
              >
                Launch campaign
              </Button>
            )}
          </div>
        }
      />
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="surface p-5">
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-zinc-500">Daily budget</dt>
              <dd className="mt-1 font-medium tabular-nums text-zinc-900">
                ${campaign.draft.campaign.daily_budget_usd}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Ad groups</dt>
              <dd className="mt-1 font-medium text-zinc-900">
                {campaign.draft.ad_groups.length}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Objective</dt>
              <dd className="mt-1 font-medium text-zinc-900">
                {campaign.draft.campaign.objective}
              </dd>
            </div>
          </dl>
        </div>

        {canEditDraft && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-600">
                Edit context hints, ads, and creatives before re-running
                simulation.
              </p>
              {canSimulate && (
                <Link href={`/campaigns/${id}/simulate`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    {campaign.status === "simulated"
                      ? "Re-run simulation"
                      : "Run simulation"}
                  </Button>
                </Link>
              )}
            </div>
            <CampaignDraftEditor
              draft={campaign.draft}
              onChange={(draft) => setCampaignDraft(id, draft)}
            />
          </>
        )}

        {!canEditDraft && (
          <div className="flex flex-wrap gap-3">
            {campaign.status === "active" && (
              <p className="text-sm text-zinc-600">
                Campaign is live in OpenAI Ads Manager.
              </p>
            )}
            {campaign.status === "pending_review" && (
              <p className="text-sm text-amber-700">
                Pending review in OpenAI Ads Manager.
              </p>
            )}
          </div>
        )}

        {canEditDraft && canSimulate && (
          <div className="flex justify-end">
            <Link href={`/campaigns/${id}/simulate`}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                {campaign.status === "simulated"
                  ? "Re-run simulation"
                  : "Run simulation"}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <LaunchModal
        open={showLaunch}
        onClose={() => setShowLaunch(false)}
        draft={campaign.draft}
        campaignId={id}
        onComplete={() => setShowLaunch(false)}
      />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending_review: "bg-amber-50 text-amber-700 border-amber-200",
    draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
    simulated: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <Badge variant="outline" className={variants[status] ?? variants.draft}>
      {status.replace("_", " ")}
    </Badge>
  );
}
