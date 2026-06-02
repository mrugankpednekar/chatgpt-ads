"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { CampaignDraftEditor } from "@/components/campaign/CampaignDraftEditor";
import { TopNav } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_CAMPAIGN_BRIEF,
  loadPrebakedDraft,
  shouldUsePrebakedDraft,
} from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import type { CampaignDraft } from "@/lib/types";

export default function NewCampaignPage() {
  const router = useRouter();
  const brand = useAppStore((s) => s.brand);
  const addCampaign = useAppStore((s) => s.addCampaign);
  const [brief, setBrief] = useState("");
  const [draft, setDraft] = useState<CampaignDraft | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateDraft(inputBrief: string) {
    setLoading(true);
    setBrief(inputBrief);

    try {
      let result: CampaignDraft;
      if (shouldUsePrebakedDraft(inputBrief)) {
        result = await loadPrebakedDraft();
        toast.success("Campaign drafted");
      } else {
        const res = await fetch("/api/draft-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, brief: inputBrief }),
        });
        if (!res.ok) throw new Error("Draft failed");
        const data = await res.json();
        result = data.draft;
        toast.success("Campaign generated");
      }
      setDraft(result);
    } catch {
      toast.error("Failed to generate campaign");
    } finally {
      setLoading(false);
    }
  }

  function handleSaveAndSimulate() {
    if (!draft) return;
    const id = `campaign_${Date.now()}`;
    addCampaign({
      id,
      name: draft.campaign.name,
      status: "draft",
      draft,
      naturalLanguageBrief: brief,
      createdAt: new Date().toISOString(),
    });
    router.push(`/campaigns/${id}/simulate`);
  }

  return (
    <>
      <TopNav title="Create campaign" />
      <div className="mx-auto max-w-4xl space-y-6 p-6">
        {!draft ? (
          <div className="space-y-4">
            <div className="surface p-6">
              <label className="text-sm font-medium text-zinc-900">
                Describe your campaign in plain English
              </label>
              <Textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder={DEFAULT_CAMPAIGN_BRIEF}
                className="mt-3 min-h-32 resize-none bg-white text-base"
              />
              <Button
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                disabled={loading || !brief.trim()}
                onClick={() => generateDraft(brief || DEFAULT_CAMPAIGN_BRIEF)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Drafting…
                  </>
                ) : (
                  "Generate campaign"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  {draft.campaign.name}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {draft.campaign.objective} · ${draft.campaign.daily_budget_usd}
                  /day · {draft.campaign.duration_days} days
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  Edit context hints, ads, and creatives below before running
                  simulation.
                </p>
              </div>
              <Button
                className="shrink-0 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSaveAndSimulate}
              >
                Run simulation
              </Button>
            </div>

            <CampaignDraftEditor draft={draft} onChange={setDraft} />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDraft(null)}>
                Start over
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSaveAndSimulate}
              >
                Run simulation
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
