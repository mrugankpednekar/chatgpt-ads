"use client";

import { Loader2 } from "lucide-react";

import { ContextHintPanel } from "@/components/ContextHintPanel";
import { ConversationCard } from "@/components/ConversationCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation, Creative, HintScoreProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SimulationViewProps {
  conversations: Conversation[];
  hintScores: Record<string, HintScoreProgress>;
  hints: string[];
  progress: number;
  totalConversations: number;
  creatives?: Creative[];
  onCancel: () => void;
  brandName?: string;
}

function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0 || !Number.isFinite(seconds)) return "Almost done";
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.ceil(seconds % 60);
  return `${minutes}m ${remainingSeconds}s remaining`;
}

function estimateRemainingSeconds(progress: number): number {
  if (progress <= 0) return 90;
  const totalEstimate = 90;
  return ((100 - progress) / progress) * (totalEstimate * (progress / 100));
}

export function SimulationView({
  conversations,
  hintScores,
  hints,
  progress,
  totalConversations,
  creatives = [],
  onCancel,
  brandName,
}: SimulationViewProps) {
  const remainingSeconds = estimateRemainingSeconds(progress);
  const creativePhaseStarted = progress >= 70;

  return (
    <div className="flex min-h-[70vh] flex-col gap-6">
      {brandName && (
        <p className="text-sm text-muted-foreground">
          Simulating <span className="text-foreground">{brandName}</span>
        </p>
      )}

      <div className="grid flex-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <section className="surface flex min-h-[480px] flex-col">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-medium text-foreground">
              Conversations
            </h2>
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              {conversations.length} / {totalConversations}
            </p>
          </div>

          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-3 pr-3">
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                />
              ))}
              {conversations.length === 0 && (
                <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    Waiting for conversations…
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </section>

        <section className="surface flex min-h-[480px] flex-col">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-medium text-foreground">
              Context hints
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Match scoring across conversations
            </p>
          </div>

          <ScrollArea className="flex-1 px-5 py-4">
            <div className="space-y-3 pr-3">
              {hints.map((hint) => {
                const score = hintScores[hint] ?? {
                  matchCount: 0,
                  matchRate: 0,
                  intentQuality: 0,
                  isComplete: false,
                };

                return (
                  <ContextHintPanel
                    key={hint}
                    hint={hint}
                    matchCount={score.matchCount}
                    totalConversations={totalConversations}
                    matchRate={score.matchRate}
                    intentQuality={score.intentQuality}
                    isComplete={score.isComplete}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </section>
      </div>

      {creatives.length > 0 && (
        <section className="surface p-5">
          <h2 className="text-sm font-medium text-foreground">
            Creative scoring
          </h2>
          {!creativePhaseStarted && (
            <p className="mt-1 text-xs text-muted-foreground">
              Starts after hint scoring
            </p>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {creatives.map((creative) => (
              <div
                key={creative.id}
                className={cn(
                  "flex gap-3 rounded-md border border-border p-3",
                  !creativePhaseStarted && "opacity-50",
                )}
              >
                {creative.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={creative.imageUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-md border border-border bg-zinc-50 object-cover"
                  />
                ) : (
                  <div className="size-12 shrink-0 rounded-md border border-dashed border-border bg-zinc-50" />
                )}
                <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-foreground">
                  {creative.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {creative.description}
                </p>
                {creativePhaseStarted && progress < 100 && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Loader2 className="size-3 animate-spin" />
                    Scoring
                  </p>
                )}
                {progress >= 100 && (
                  <p className="mt-2 text-xs text-primary">Complete</p>
                )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="surface p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Progress</span>
              <span className="font-mono tabular-nums text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground">
              {formatTimeRemaining(remainingSeconds)}
            </p>
          </div>

          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
