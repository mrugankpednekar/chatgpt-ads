"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ContextHintPanelProps {
  hint: string;
  matchCount: number;
  totalConversations: number;
  matchRate: number;
  intentQuality: number;
  isComplete: boolean;
}

function getMatchBadgeClass(matchRate: number): string {
  if (matchRate < 0.1) {
    return "border-destructive/30 bg-destructive/5 text-destructive";
  }
  if (matchRate < 0.3) {
    return "border-border bg-secondary text-muted-foreground";
  }
  return "border-primary/30 bg-primary/5 text-primary";
}

function getMatchLabel(matchRate: number): string {
  if (matchRate < 0.1) return "Drop";
  if (matchRate < 0.3) return "Pause";
  return "Use";
}

export function ContextHintPanel({
  hint,
  matchCount,
  totalConversations,
  matchRate,
  intentQuality,
  isComplete,
}: ContextHintPanelProps) {
  const matchPercent = matchRate * 100;

  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm font-medium leading-snug text-foreground">{hint}</p>

      <p className="mt-2 text-xs text-muted-foreground">
        <span className="font-mono tabular-nums text-foreground">
          {matchCount}
        </span>{" "}
        / {totalConversations} matched
      </p>

      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Match rate</span>
          <span className="font-mono tabular-nums text-foreground">
            {matchPercent.toFixed(1)}%
          </span>
        </div>
        <Progress value={matchPercent} className="h-1" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Intent quality</p>
          <p className="font-mono text-sm tabular-nums text-foreground">
            {(intentQuality * 100).toFixed(0)}%
          </p>
        </div>

        {isComplete && (
          <Badge
            variant="outline"
            className={cn("shrink-0 rounded-sm", getMatchBadgeClass(matchRate))}
          >
            {getMatchLabel(matchRate)}
          </Badge>
        )}
      </div>
    </div>
  );
}
