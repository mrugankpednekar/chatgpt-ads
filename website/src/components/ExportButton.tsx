"use client";

import type { UIResults } from "@/lib/types";

interface ExportButtonProps {
  results: UIResults;
  brandName: string;
}

function escapeCsvValue(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function buildBulkUploadCsv(results: UIResults, brandName: string): string {
  const activeHints = results.hints.filter(
    (hint) => hint.recommendation !== "Drop"
  );
  const winnerCreative = results.creatives.find((creative) => creative.isWinner);

  const headers = [
    "campaign_name",
    "ad_group_name",
    "context_hints",
    "ad_title",
    "ad_description",
    "landing_page",
    "max_cpc",
    "recommendation",
  ];

  const rows = activeHints.map((hint, index) => {
    const contextHintsJson = JSON.stringify([hint.hint]);

    return [
      brandName,
      `${brandName} - Ad Group ${index + 1}`,
      contextHintsJson,
      winnerCreative?.creative.title ?? "",
      winnerCreative?.creative.description ?? "",
      winnerCreative?.creative.landingPage ?? "",
      results.campaign.recommendedMaxCPC.toFixed(2),
      hint.recommendation,
    ]
      .map((value) => escapeCsvValue(String(value)))
      .join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export function ExportButton({ results, brandName }: ExportButtonProps) {
  const handleExport = () => {
    const csv = buildBulkUploadCsv(results, brandName);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    link.href = url;
    link.download = `${safeName || "campaign"}-chatgpt-ads-bulk-upload.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
    >
      Export Campaign CSV
    </button>
  );
}
