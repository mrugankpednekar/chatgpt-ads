"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ResultsDashboard } from "@/components/ResultsDashboard";
import { SimulationView } from "@/components/SimulationView";
import { LaunchModal } from "@/components/campaign/LaunchModal";
import { TopNav } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  TOTAL_CONVERSATIONS,
  usePlatformSimulation,
} from "@/hooks/usePlatformSimulation";
import { useAppStore } from "@/lib/store";
import { draftToBrandInput } from "@/lib/types";

export default function SimulatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const campaign = useAppStore((s) => s.getCampaign(id));
  const brand = useAppStore((s) => s.brand);
  const setCampaignResults = useAppStore((s) => s.setCampaignResults);
  const setCampaignDraft = useAppStore((s) => s.setCampaignDraft);
  const applyRecommendation = useAppStore((s) => s.applyRecommendation);

  const sim = usePlatformSimulation(campaign, brand);
  const [showLaunch, setShowLaunch] = useState(false);

  useEffect(() => {
    if (campaign && !sim.isSimulating && !sim.isComplete && !sim.error) {
      void sim.runSimulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?.id]);

  const resultsSavedRef = useRef(false);
  useEffect(() => {
    if (!sim.isComplete) {
      resultsSavedRef.current = false;
      return;
    }
    if (sim.results && !resultsSavedRef.current) {
      resultsSavedRef.current = true;
      setCampaignResults(id, sim.results);
    }
  }, [sim.isComplete, sim.results, id, setCampaignResults]);

  if (!campaign) {
    return (
      <div className="p-6 text-sm text-zinc-500">Campaign not found</div>
    );
  }

  const primaryHints = campaign.draft.ad_groups[0]?.context_hints ?? [];

  const handleContextHintsChange = (
    hints: typeof primaryHints,
  ) => {
    const draft = structuredClone(campaign.draft);
    const group = draft.ad_groups[0];
    if (group) {
      group.context_hints = hints;
      setCampaignDraft(id, draft);
    }
  };

  const handleTestHints = () => {
    const latest = useAppStore.getState().getCampaign(id)?.draft;
    if (latest) void sim.runSimulation(latest);
  };

  const runWithLatestDraft = () => {
    const latest = useAppStore.getState().getCampaign(id)?.draft;
    void sim.runSimulation(latest);
  };

  if (sim.isComplete && sim.results) {
    return (
      <>
        <TopNav
          title="Simulation results"
          actions={
            <Link href={`/campaigns/${id}/results`}>
              <Button variant="outline" size="sm">
                Saved results
              </Button>
            </Link>
          }
        />
        <div className="p-6">
          <ResultsDashboard
            results={sim.results}
            brandName={brand.name}
            campaignName={campaign.name}
            contextHints={primaryHints}
            onContextHintsChange={handleContextHintsChange}
            onTestHints={handleTestHints}
            isTestingHints={sim.isSimulating}
            onRunAnother={runWithLatestDraft}
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

  return (
    <>
      <TopNav
        title="Pre-spend simulation"
        actions={
          <Button variant="outline" size="sm" onClick={sim.handleCancel}>
            Cancel
          </Button>
        }
      />
      <div className="p-6">
        {sim.error ? (
          <div className="surface p-6 text-center">
            <p className="text-red-600">{sim.error}</p>
            <Button
              className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              onClick={runWithLatestDraft}
            >
              Retry
            </Button>
          </div>
        ) : (
          <SimulationView
            conversations={sim.conversations}
            hintScores={sim.hintScores}
            hints={sim.contextHints}
            progress={sim.progress}
            totalConversations={TOTAL_CONVERSATIONS}
            creatives={draftToBrandInput(campaign.draft, brand).creatives}
            onCancel={sim.handleCancel}
            brandName={brand.name}
          />
        )}
      </div>
    </>
  );
}
