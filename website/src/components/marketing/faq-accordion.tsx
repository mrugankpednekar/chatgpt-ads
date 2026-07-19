"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span className="text-sm font-semibold text-zinc-900">{item.q}</span>
              <ChevronDown
                className={`size-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-600">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
