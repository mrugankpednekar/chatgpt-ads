"use client";

import { useId, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { EditableContextHints } from "@/components/EditableContextHints";
import { ExportButton } from "@/components/ExportButton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  ContextHintDraft,
  HintResultRow,
  Recommendation,
  UIResults,
} from "@/lib/types";

interface ResultsDashboardProps {
  results: UIResults;
  brandName: string;
  campaignName?: string;
  showComparison?: boolean;
  onRunAnother: () => void;
  backHref?: string;
  backLabel?: string;
  onApplyRecommendation?: (recommendation: string) => void;
  onLaunch?: () => void;
  contextHints?: ContextHintDraft[];
  onContextHintsChange?: (hints: ContextHintDraft[]) => void;
  onTestHints?: () => void;
  isTestingHints?: boolean;
}

type SortKey =
  | "hint"
  | "matchRate"
  | "intentQuality"
  | "estimatedWeeklyImpressions"
  | "competitionDensity"
  | "recommendation";

type SortDirection = "asc" | "desc";

function recommendationClass(recommendation: Recommendation): string {
  switch (recommendation) {
    case "Use":
      return "border-primary/30 bg-primary/5 text-primary";
    case "Pause":
      return "border-border bg-secondary text-muted-foreground";
    case "Drop":
      return "border-destructive/30 bg-destructive/5 text-destructive";
  }
}

function competitionLabel(
  density: HintResultRow["competitionDensity"]
): string {
  return density.charAt(0).toUpperCase() + density.slice(1);
}

function SparklineChart({ data }: { data?: number[] }) {
  const gradientId = `sparkline-${useId().replace(/:/g, "")}`;
  const chartData = useMemo(
    () =>
      (data ?? [12, 18, 15, 22, 28, 24, 32]).map((value, index) => ({
        index,
        value,
      })),
    [data],
  );

  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.42 0.11 155)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="oklch(0.42 0.11 155)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              border: "1px solid #e4e4e7",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelFormatter={() => ""}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="oklch(0.42 0.11 155)"
            fill={`url(#${gradientId})`}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  sparkline,
}: {
  label: string;
  value: string;
  detail?: string;
  sparkline?: number[];
}) {
  return (
    <Card className="border border-border bg-card shadow-none">
      <CardHeader className="gap-3 p-6 pb-2">
        <CardDescription className="label-mono">{label}</CardDescription>
        <CardTitle className="metric-value font-semibold">{value}</CardTitle>
        {detail ? (
          <p className="text-xs text-muted-foreground">{detail}</p>
        ) : null}
      </CardHeader>
      {sparkline && (
        <CardContent className="pt-0">
          <SparklineChart data={sparkline} />
        </CardContent>
      )}
    </Card>
  );
}

function SortButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
    >
      {label}
      {active &&
        (direction === "asc" ? (
          <ArrowUp className="size-3" />
        ) : (
          <ArrowDown className="size-3" />
        ))}
    </button>
  );
}

export function ResultsDashboard({
  results,
  brandName,
  campaignName,
  showComparison,
  onRunAnother,
  backHref,
  backLabel,
  onApplyRecommendation,
  onLaunch,
  contextHints,
  onContextHintsChange,
  onTestHints,
  isTestingHints,
}: ResultsDashboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>("matchRate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showDropped, setShowDropped] = useState(false);

  const sortedHints = useMemo(() => {
    const copy = [...results.hints];
    copy.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];

      if (typeof left === "number" && typeof right === "number") {
        return sortDirection === "asc" ? left - right : right - left;
      }

      const leftValue = String(left).toLowerCase();
      const rightValue = String(right).toLowerCase();
      if (leftValue === rightValue) return 0;
      const comparison = leftValue.localeCompare(rightValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [results.hints, sortDirection, sortKey]);

  const droppedHints = sortedHints.filter(
    (hint) => hint.recommendation === "Drop"
  );
  const visibleHints = sortedHints.filter(
    (hint) => hint.recommendation !== "Drop" || showDropped
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection(key === "hint" ? "asc" : "desc");
  };

  const { campaign, creatives } = results;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Predicted weekly impressions"
          value={campaign.predictedWeeklyImpressions.toLocaleString()}
          sparkline={campaign.impressionSparkline}
        />
        <MetricCard
          label="Recommended max CPC"
          value={`$${campaign.recommendedMaxCPC.toFixed(2)}`}
          detail={`$${campaign.recommendedCPCRange.min.toFixed(2)} – $${campaign.recommendedCPCRange.max.toFixed(2)} range`}
        />
        <MetricCard
          label="Predicted CTR"
          value={`${campaign.predictedCTR.toFixed(1)}%`}
          detail={`${(campaign.ctrConfidence * 100).toFixed(0)}% confidence`}
          sparkline={campaign.impressionSparkline}
        />
        <MetricCard
          label="Est. weekly spend"
          value={`$${campaign.estimatedWeeklySpend.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`}
          detail="At recommended bids"
          sparkline={campaign.spendSparkline}
        />
      </div>

      {contextHints && onContextHintsChange && onTestHints ? (
        <EditableContextHints
          hints={contextHints}
          onChange={onContextHintsChange}
          onTestHints={onTestHints}
          isTesting={isTestingHints}
        />
      ) : null}

      <Card className="border border-border bg-card shadow-none">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-sm font-medium text-foreground">
            Context hints
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto px-6 pb-6 pt-0">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {(
                  [
                    ["hint", "Hint"],
                    ["matchRate", "Match"],
                    ["intentQuality", "Intent"],
                    ["estimatedWeeklyImpressions", "Impressions"],
                    ["competitionDensity", "Competition"],
                    ["recommendation", "Action"],
                  ] as const
                ).map(([key, label]) => (
                  <th key={key} className="px-4 py-4 font-normal">
                    <SortButton
                      label={label}
                      active={sortKey === key}
                      direction={sortDirection}
                      onClick={() => toggleSort(key)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleHints.map((hint) => (
                <tr
                  key={hint.hint}
                  className="border-b border-border/60 last:border-0"
                >
                  <td className="max-w-xs px-4 py-4 text-foreground">
                    {hint.hint}
                  </td>
                  <td className="px-4 py-4 font-mono tabular-nums text-muted-foreground">
                    {(hint.matchRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-4 py-4 font-mono tabular-nums text-muted-foreground">
                    {(hint.intentQuality * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-4 font-mono tabular-nums text-muted-foreground">
                    {hint.estimatedWeeklyImpressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {competitionLabel(hint.competitionDensity)}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant="outline"
                      className={recommendationClass(hint.recommendation)}
                    >
                      {hint.recommendation}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {droppedHints.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDropped((current) => !current)}
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {showDropped ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
              {showDropped ? "Hide" : "Show"} {droppedHints.length} dropped
              hint{droppedHints.length === 1 ? "" : "s"}
            </button>
          )}
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-3 text-sm font-medium text-foreground">
          Creative variants
        </h3>
        <div className="grid gap-3 lg:grid-cols-3">
          {creatives.map((creativeScore, index) => (
            <Card
              key={`${creativeScore.creative.title}-${index}`}
              className={cn(
                "surface overflow-hidden shadow-none",
                creativeScore.isWinner && "border-primary/40",
              )}
            >
              {creativeScore.creative.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={creativeScore.creative.imageUrl}
                  alt=""
                  className="h-32 w-full border-b border-zinc-200 bg-zinc-50 object-cover"
                />
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base text-foreground">
                    {creativeScore.creative.title}
                  </CardTitle>
                  {creativeScore.isWinner && (
                    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                      Winner
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-muted-foreground">
                  {creativeScore.creative.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  CTA:{" "}
                  <span className="text-foreground">
                    {creativeScore.creative.landingPage}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Predicted CTR</p>
                    <p className="font-mono font-medium tabular-nums text-foreground">
                      {creativeScore.predictedCTR.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clicks / 1k</p>
                    <p className="font-mono font-medium tabular-nums text-foreground">
                      {creativeScore.predictedClicksPer1000.toFixed(1)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Win rate</p>
                    <p className="font-mono font-medium tabular-nums text-foreground">
                      {(creativeScore.winRate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="surface shadow-none">
        <CardHeader>
          <CardTitle className="text-foreground">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.recommendations.map((item) => (
              <li
                key={item}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">{item}</span>
                {onApplyRecommendation && (
                  <button
                    type="button"
                    onClick={() => onApplyRecommendation(item)}
                    className="shrink-0 text-xs font-medium text-primary hover:underline"
                  >
                    Apply
                  </button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
        <ExportButton results={results} brandName={brandName} />
        <div className="flex flex-wrap gap-3">
          {onLaunch && (
            <button
              type="button"
              onClick={onLaunch}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Launch campaign
            </button>
          )}
          <button
            type="button"
            onClick={onRunAnother}
            className="text-sm text-primary hover:underline"
          >
            Re-run simulation
          </button>
        </div>
      </div>
    </div>
  );
}
