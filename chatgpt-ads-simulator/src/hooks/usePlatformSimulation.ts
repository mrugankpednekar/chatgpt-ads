"use client";

import { useCallback, useRef, useState } from "react";

import { consumeSimulationStream } from "@/lib/consume-simulation-stream";
import {
  loadDemoCache,
  replayDemoEvents,
  shouldUseDemoCache,
} from "@/lib/demo-data";
import type {
  BrandProfile,
  CampaignDraft,
  Conversation,
  HintScoreProgress,
  PlatformCampaign,
  SimulationEvent,
  UIResults,
} from "@/lib/types";
import { draftToBrandInput, toUIResults } from "@/lib/types";

export const TOTAL_CONVERSATIONS = 20;

function createInitialHintScores(
  hints: string[],
): Record<string, HintScoreProgress> {
  return Object.fromEntries(
    hints.map((hint) => [
      hint,
      { matchCount: 0, matchRate: 0, intentQuality: 0, isComplete: false },
    ]),
  );
}

export function usePlatformSimulation(
  campaign: PlatformCampaign | undefined,
  brand: BrandProfile,
) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [hintScores, setHintScores] = useState<
    Record<string, HintScoreProgress>
  >({});
  const [contextHints, setContextHints] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UIResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const resultsRef = useRef<UIResults | null>(null);

  const handleSimulationEvent = useCallback((event: SimulationEvent) => {
    switch (event.type) {
      case "conversation_generated":
        setConversations((prev) => [...prev, event.conversation]);
        setProgress((prev) =>
          Math.min(40, Math.max(prev, prev + 40 / TOTAL_CONVERSATIONS)),
        );
        break;
      case "hint_scored": {
        const { hint, progress: hp } = event;
        setHintScores((prev) => ({
          ...prev,
          [hint]: {
            matchCount: hp.matchCount,
            matchRate: hp.matchRate,
            intentQuality: hp.intentQuality,
            isComplete: hp.scoredCount >= hp.totalConversations,
          },
        }));
        setProgress((prev) =>
          Math.max(prev, 40 + (hp.scoredCount / hp.totalConversations) * 30),
        );
        break;
      }
      case "creative_scored":
        setProgress((prev) =>
          Math.max(
            prev,
            70 +
              (event.progress.scoredCount / event.progress.totalSamples) * 25,
          ),
        );
        break;
      case "complete": {
        const ui = toUIResults(event.results);
        setResults(ui);
        resultsRef.current = ui;
        setProgress(100);
        setIsComplete(true);
        setIsSimulating(false);
        break;
      }
      case "error":
        setError(event.message);
        setIsSimulating(false);
        break;
    }
  }, []);

  const runSimulation = useCallback(
    async (draft?: CampaignDraft): Promise<UIResults | null> => {
      if (!campaign && !draft) return null;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const brandInput = draftToBrandInput(
        draft ?? campaign!.draft,
        brand,
      );
      setContextHints(brandInput.contextHints);
      setConversations([]);
      setHintScores(createInitialHintScores(brandInput.contextHints));
      setProgress(0);
      setResults(null);
      resultsRef.current = null;
      setError(null);
      setIsComplete(false);
      setIsSimulating(true);

      try {
        if (shouldUseDemoCache(brandInput)) {
          const cache = await loadDemoCache("bubble-skincare-simulation");
          if (cache?.events?.length) {
            await replayDemoEvents(cache.events, (event) => {
              if (controller.signal.aborted) return;
              handleSimulationEvent(event);
            });
            return resultsRef.current;
          }
        }

        const response = await fetch("/api/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(brandInput),
          signal: controller.signal,
        });

        await consumeSimulationStream(response, (event) => {
          if (controller.signal.aborted) return;
          handleSimulationEvent(event);
        });

        return resultsRef.current;
      } catch (err) {
        if (controller.signal.aborted) return null;
        setError(err instanceof Error ? err.message : "Simulation failed");
        setIsSimulating(false);
        return null;
      }
    },
    [campaign, brand, handleSimulationEvent],
  );

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setIsSimulating(false);
  }, []);

  return {
    isSimulating,
    isComplete,
    conversations,
    hintScores,
    contextHints,
    progress,
    results,
    error,
    runSimulation,
    handleCancel,
  };
}
