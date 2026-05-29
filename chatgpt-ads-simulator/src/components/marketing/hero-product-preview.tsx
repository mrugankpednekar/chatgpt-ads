"use client";

import { useEffect, useState } from "react";

type Hint = { label: string; score: number };

type PreviewSet = {
  brand: string;
  conversations: string[];
  hints: Hint[];
  progress: number;
};

const PREVIEW_SETS: PreviewSet[] = [
  {
    brand: "Bubble Skincare",
    conversations: [
      "Best skincare for combo skin teens under $25?",
      "Alternatives to CeraVe that won't break out sensitive skin",
      "How do I treat hyperpigmentation gently? I'm 19",
      "Cheap skincare routine for college student",
      "Best Gen Z skincare brands recommended by dermatologists",
    ],
    hints: [
      { label: "Gen Z sensitive skin, budget-conscious", score: 84 },
      { label: "Affordable routine, not luxury brands", score: 71 },
      { label: "Hyperpigmentation treatment for young adults", score: 58 },
      { label: "Holiday gift sets under $40", score: 32 },
    ],
    progress: 23,
  },
  {
    brand: "Athletic Greens",
    conversations: [
      "Best greens powder for busy professionals?",
      "AG1 alternatives that cost less per month",
      "Daily nutrition supplement for 30-year-olds",
      "Is greens powder worth it for energy?",
    ],
    hints: [
      { label: "Health-conscious professionals, daily routine", score: 79 },
      { label: "AG1 alternatives under $80/mo", score: 66 },
      { label: "Energy and focus supplements", score: 52 },
      { label: "Weight loss greens powder", score: 29 },
    ],
    progress: 31,
  },
];

function barColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 30) return "bg-amber-500";
  return "bg-red-400";
}

export function HeroProductPreview() {
  const [index, setIndex] = useState(0);
  const set = PREVIEW_SETS[index];

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % PREVIEW_SETS.length),
      8000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Pre-spend simulation
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">{set.brand}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-5">
        <div className="sm:col-span-3">
          <p className="mb-2 text-xs font-medium text-zinc-500">
            Synthetic conversations
          </p>
          <ul className="space-y-2">
            {set.conversations.slice(0, 4).map((line) => (
              <li
                key={line}
                className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-left text-xs leading-snug text-zinc-700"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-xs font-medium text-zinc-500">
            Context hint scores
          </p>
          <ul className="space-y-3">
            {set.hints.map((hint) => (
              <li key={hint.label}>
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="text-left text-[11px] leading-snug text-zinc-700">
                    {hint.label}
                  </span>
                  <span className="shrink-0 font-mono text-xs font-semibold tabular-nums text-zinc-900">
                    {hint.score}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor(hint.score)}`}
                    style={{ width: `${hint.score}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>{set.progress} of 200 conversations scored</span>
          <span className="font-mono tabular-nums">
            {Math.round((set.progress / 200) * 100)}%
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${(set.progress / 200) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
