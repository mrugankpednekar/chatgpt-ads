"use client";

const conversations = [
  "Best skincare for sensitive skin under $25?",
  "Alternatives to CeraVe for teens?",
  "How to treat hyperpigmentation gently?",
];

const hints = [
  { text: "Gen Z acne-prone, budget-conscious", score: 84 },
  { text: "Affordable routine, not luxury brands", score: 71 },
  { text: "Holiday gift sets under $40", score: 38 },
];

export function SimulationPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3">
        <p className="text-xs font-medium text-zinc-500">
          Pre-spend simulation · live preview
        </p>
      </div>
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="border-b border-zinc-200 p-4 sm:border-b-0 sm:border-r">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Synthetic conversations
          </p>
          <ul className="space-y-2">
            {conversations.map((line, index) => (
              <li
                key={line}
                className="sim-convo-line rounded-md bg-zinc-50 px-3 py-2 text-left text-sm text-zinc-700"
                style={{ animationDelay: `${index * 1.2}s` }}
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Context hint scores
          </p>
          <ul className="space-y-2">
            {hints.map((hint, index) => (
              <li
                key={hint.text}
                className="sim-score-row flex items-center justify-between gap-3 rounded-md border border-zinc-100 px-3 py-2"
                style={{ animationDelay: `${0.8 + index * 0.9}s` }}
              >
                <span className="text-left text-xs leading-snug text-zinc-600">
                  {hint.text}
                </span>
                <span className="shrink-0 font-mono text-sm font-medium tabular-nums text-emerald-600">
                  {hint.score}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
