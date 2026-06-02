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

const GENERATION_MIN_DELAY_MS = 1800;

const GENERATION_STEPS = [
  "Parsing campaign brief",
  "Drafting ad groups and personas",
  "Generating context hints",
  "Writing ad copy and creatives",
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function NewCampaignPage() {
  const router = useRouter();
  const brand = useAppStore((s) => s.brand);
  const addCampaign = useAppStore((s) => s.addCampaign);
  const [brief, setBrief] = useState("");
  const [draft, setDraft] = useState<CampaignDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  async function generateDraft(inputBrief: string) {
    setLoading(true);
    setGenerationStep(0);
    setBrief(inputBrief);

    const stepTimer = window.setInterval(() => {
      setGenerationStep((current) =>
        current < GENERATION_STEPS.length - 1 ? current + 1 : current,
      );
    }, 450);

    try {
      let result: CampaignDraft;
      const draftPromise = (async () => {
        if (shouldUsePrebakedDraft(inputBrief)) {
          return loadPrebakedDraft();
        }

        const res = await fetch("/api/draft-campaign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, brief: inputBrief }),
        });
        if (!res.ok) throw new Error("Draft failed");
        const data = await res.json();
        return data.draft as CampaignDraft;
      })();

      const [loadedDraft] = await Promise.all([
        draftPromise,
        delay(GENERATION_MIN_DELAY_MS),
      ]);

      result = loadedDraft;
      setDraft(result);
      toast.success(
        shouldUsePrebakedDraft(inputBrief)
          ? "Campaign drafted"
          : "Campaign generated",
      );
    } catch {
      toast.error("Failed to generate campaign");
    } finally {
      window.clearInterval(stepTimer);
      setLoading(false);
      setGenerationStep(0);
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
        {loading ? (
          <div className="surface flex min-h-[320px] flex-col items-center justify-center p-10 text-center">
            <Loader2 className="size-8 animate-spin text-emerald-600" />
            <p className="mt-4 text-sm font-medium text-zinc-900">
              Building your campaign
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {GENERATION_STEPS[generationStep]}
            </p>
            <ul className="mt-6 space-y-2 text-left text-xs text-zinc-400">
              {GENERATION_STEPS.map((step, index) => (
                <li
                  key={step}
                  className={
                    index <= generationStep
                      ? "text-emerald-700"
                      : "text-zinc-400"
                  }
                >
                  {index < generationStep ? "✓" : index === generationStep ? "…" : "○"}{" "}
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ) : !draft ? (
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
                disabled={!brief.trim()}
                onClick={() => generateDraft(brief || DEFAULT_CAMPAIGN_BRIEF)}
              >
                Generate campaign
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
