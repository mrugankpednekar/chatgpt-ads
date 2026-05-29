"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Hint = { id: string; label: string; score: number };

type PreviewBrand = {
  brand: string;
  conversations: string[];
  hints: Omit<Hint, "id">[];
  progress: number;
};

const PREVIEW_BRANDS: PreviewBrand[] = [
  {
    brand: "Bubble Skincare",
    conversations: [
      "Best skincare for combo skin teens under $25?",
      "Alternatives to CeraVe that won't break out sensitive skin",
      "How do I treat hyperpigmentation gently? I'm 19",
      "Cheap skincare routine for college student",
      "Best Gen Z skincare brands recommended by dermatologists",
      "Drugstore moisturizer for oily sensitive skin",
      "What order should I apply serum and sunscreen?",
    ],
    hints: [
      { label: "Gen Z sensitive skin, budget-conscious", score: 84 },
      { label: "Affordable routine, not luxury brands", score: 71 },
      { label: "Hyperpigmentation treatment for young adults", score: 58 },
      { label: "Holiday gift sets under $40", score: 32 },
    ],
    progress: 18,
  },
  {
    brand: "Athletic Greens",
    conversations: [
      "Best greens powder for busy professionals?",
      "AG1 alternatives that cost less per month",
      "Daily nutrition supplement for 30-year-olds",
      "Is greens powder worth it for energy?",
      "Morning supplement stack for focus at work",
      "Vegan greens powder with no stevia taste",
    ],
    hints: [
      { label: "Health-conscious professionals, daily routine", score: 79 },
      { label: "AG1 alternatives under $80/mo", score: 66 },
      { label: "Energy and focus supplements", score: 52 },
      { label: "Weight loss greens powder", score: 29 },
    ],
    progress: 24,
  },
];

function barColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 30) return "bg-amber-500";
  return "bg-red-400";
}

function withIds(hints: Omit<Hint, "id">[]): Hint[] {
  return hints.map((hint) => ({ ...hint, id: hint.label }));
}

export function HeroProductPreview() {
  const [brandIndex, setBrandIndex] = useState(0);
  const [brand, setBrand] = useState(PREVIEW_BRANDS[0]);
  const [convos, setConvos] = useState<string[]>(
    PREVIEW_BRANDS[0].conversations.slice(0, 4),
  );
  const [hints, setHints] = useState<Hint[]>(
    withIds(PREVIEW_BRANDS[0].hints),
  );
  const [progress, setProgress] = useState(PREVIEW_BRANDS[0].progress);
  const convoIndexRef = useRef(4);

  useEffect(() => {
    const nextBrand = PREVIEW_BRANDS[brandIndex];
    setBrand(nextBrand);
    setConvos(nextBrand.conversations.slice(0, 4));
    setHints(withIds(nextBrand.hints));
    setProgress(nextBrand.progress);
    convoIndexRef.current = 4;
  }, [brandIndex]);

  useEffect(() => {
    const scrollTimer = setInterval(() => {
      setConvos((current) => {
        const pool = PREVIEW_BRANDS[brandIndex].conversations;
        convoIndexRef.current =
          (convoIndexRef.current + 1) % pool.length;
        const nextLine = pool[convoIndexRef.current];
        return [nextLine, ...current.slice(0, 3)];
      });
    }, 2600);

    return () => clearInterval(scrollTimer);
  }, [brandIndex]);

  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setHints((current) =>
        [...current]
          .map((hint) => ({
            ...hint,
            score: Math.min(
              96,
              Math.max(8, hint.score + Math.floor(Math.random() * 7) - 3),
            ),
          }))
          .sort((a, b) => b.score - a.score),
      );

      setProgress((current) => {
        const next = current + 1;
        if (next >= 200) {
          setBrandIndex((index) => (index + 1) % PREVIEW_BRANDS.length);
          return PREVIEW_BRANDS[(brandIndex + 1) % PREVIEW_BRANDS.length]
            .progress;
        }
        return next;
      });
    }, 1700);

    return () => clearInterval(scoreTimer);
  }, [brandIndex]);

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Pre-spend simulation
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">{brand.brand}</p>
        </div>
        <p className="font-mono text-[11px] tabular-nums text-zinc-400">
          {progress}/200
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-5">
        <div className="sm:col-span-3">
          <p className="mb-2 text-xs font-medium text-zinc-500">
            Synthetic conversations
          </p>
          <ul className="relative h-[11.5rem] space-y-2 overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              {convos.map((line) => (
                <motion.li
                  key={line}
                  layout
                  initial={{ opacity: 0, y: -14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="rounded-md border border-zinc-100 bg-zinc-50 px-3 py-2 text-left text-xs leading-snug text-zinc-700"
                >
                  {line}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-xs font-medium text-zinc-500">
            Context hint scores
          </p>
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {hints.map((hint) => (
                <motion.li
                  key={hint.id}
                  layout
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <span className="text-left text-[11px] leading-snug text-zinc-700">
                      {hint.label}
                    </span>
                    <motion.span
                      key={hint.score}
                      initial={{ opacity: 0.6, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="shrink-0 font-mono text-xs font-semibold tabular-nums text-zinc-900"
                    >
                      {hint.score}%
                    </motion.span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div
                      className={`h-full rounded-full ${barColor(hint.score)}`}
                      animate={{ width: `${hint.score}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>{progress} of 200 conversations scored</span>
          <span className="font-mono tabular-nums">
            {Math.round((progress / 200) * 100)}%
          </span>
        </div>
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-100">
          <motion.div
            className="h-full rounded-full bg-zinc-900"
            animate={{ width: `${(progress / 200) * 100}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
