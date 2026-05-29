"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import type { CampaignDraft } from "@/lib/types";

const STEPS = [
  { key: "campaign", label: "Creating campaign in OpenAI Ads Manager" },
  { key: "ad_group", label: "Creating ad groups" },
  { key: "creative", label: "Uploading creative assets" },
  { key: "ads", label: "Creating ads" },
  { key: "review", label: "Submitting for OpenAI review" },
];

interface LaunchModalProps {
  open: boolean;
  onClose: () => void;
  draft: CampaignDraft;
  campaignId: string;
  onComplete: () => void;
}

export function LaunchModal({
  open,
  onClose,
  draft,
  campaignId,
  onComplete,
}: LaunchModalProps) {
  const launchCampaign = useAppStore((s) => s.launchCampaign);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setCompletedSteps(new Set());
      setCurrentStep(null);
      setDone(false);
      return;
    }

    setLoading(true);
    fetch("/api/launch-campaign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ draft }),
    })
      .then(async (res) => {
        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream");
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = JSON.parse(line.slice(6));
            if (data.type === "complete") {
              launchCampaign(campaignId, data.result.campaign_id);
              setDone(true);
              toast.success("Campaign submitted for review");
              setTimeout(onComplete, 1500);
            } else if (data.type === "error") {
              toast.error(data.message);
            } else if (data.status === "in_progress") {
              setCurrentStep(data.step + (data.name ? `:${data.name}` : ""));
            } else if (data.status === "complete") {
              setCompletedSteps((prev) => {
                const next = new Set(prev);
                next.add(data.step + (data.name ? `:${data.name}` : ""));
                return next;
              });
            }
          }
        }
      })
      .catch(() => toast.error("Launch failed"))
      .finally(() => setLoading(false));
  }, [open, draft, campaignId, launchCampaign, onComplete]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Launching to ChatGPT Ads</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <AnimatePresence>
            {STEPS.map((step) => {
              const isComplete =
                completedSteps.has(step.key) ||
                [...completedSteps].some((s) => s.startsWith(step.key));
              const isCurrent = currentStep?.startsWith(step.key);
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-sm"
                >
                  {isComplete ? (
                    <Check className="size-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="size-4 animate-spin text-emerald-600" />
                  ) : (
                    <div className="size-4 rounded-full border border-zinc-300" />
                  )}
                  <span
                    className={
                      isComplete ? "text-zinc-900" : "text-zinc-500"
                    }
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {done && (
          <p className="text-sm text-emerald-600">
            Submitted for review. Approval typically takes under 24 hours.
          </p>
        )}
        {!loading && !done && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
