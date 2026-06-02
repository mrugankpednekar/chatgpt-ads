"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { ResultsDashboard } from "@/components/ResultsDashboard";
import { LaunchModal } from "@/components/campaign/LaunchModal";
import { TopNav } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

function formatSimulatedAt(iso?: string) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function CampaignResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const campaign = useAppStore((s) => s.getCampaign(id));
  const brand = useAppStore((s) => s.brand);
  const setCampaignDraft = useAppStore((s) => s.setCampaignDraft);
  const applyRecommendation = useAppStore((s) => s.applyRecommendation);
  const [showLaunch, setShowLaunch] = useState(false);

  if (!campaign) {
    return <div className="p-6 text-sm text-zinc-500">Campaign not found</div>;
  }

  if (!campaign.lastResults) {
    return (
      <>
        <TopNav title="Simulation results" />
        <div className="mx-auto max-w-lg p-6">
          <div className="surface p-8 text-center">
            <p className="text-sm text-zinc-600">
              No simulation results saved for this campaign yet.
            </p>
            <Link href={`/campaigns/${id}/simulate`} className="mt-4 inline-block">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Run simulation
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const primaryHints = campaign.draft.ad_groups[0]?.context_hints ?? [];
  const simulatedAt = formatSimulatedAt(campaign.simulatedAt);

  const handleContextHintsChange = (hints: typeof primaryHints) => {
    const draft = structuredClone(campaign.draft);
    const group = draft.ad_groups[0];
    if (group) {
      group.context_hints = hints;
      setCampaignDraft(id, draft);
    }
  };

  return (
    <>
      <TopNav
        title="Simulation results"
        actions={
          <div className="flex items-center gap-2">
            <Link href={`/campaigns/${id}`}>
              <Button variant="outline" size="sm">
                Back to campaign
              </Button>
            </Link>
            <Link href={`/campaigns/${id}/simulate`}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                Re-run
              </Button>
            </Link>
          </div>
        }
      />
      <div className="p-6">
        {simulatedAt && (
          <p className="mb-4 text-sm text-zinc-500">
            Last simulated {simulatedAt}
          </p>
        )}
        <ResultsDashboard
          results={campaign.lastResults}
          brandName={brand.name}
          campaignName={campaign.name}
          contextHints={primaryHints}
          onContextHintsChange={handleContextHintsChange}
          onTestHints={() => router.push(`/campaigns/${id}/simulate`)}
          onRunAnother={() => router.push(`/campaigns/${id}/simulate`)}
          onApplyRecommendation={(rec) => {
            applyRecommendation(id, rec);
            toast.success("Recommendation applied");
          }}
          onLaunch={() => setShowLaunch(true)}
        />
      </div>
      <LaunchModal
        open={showLaunch}
        onClose={() => setShowLaunch(false)}
        draft={campaign.draft}
        campaignId={id}
        onComplete={() => router.push(`/campaigns/${id}`)}
      />
    </>
  );
}
