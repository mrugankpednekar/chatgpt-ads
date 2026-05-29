"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Logo } from "@/components/marketing/logo";

const capabilities = [
  {
    title: "AI-drafted campaigns",
    body: "Plain English in. Campaigns, hints, and copy out.",
  },
  {
    title: "Pre-spend simulation",
    body: "Predict match rates before budget goes live.",
  },
  {
    title: "One-click launch",
    body: "Push to OpenAI with preflight validation.",
  },
  {
    title: "Continuous optimization",
    body: "Compare predicted vs. actual performance.",
  },
];

const steps = [
  { label: "Describe", detail: "Campaign, budget, audience" },
  { label: "Edit", detail: "Hints and creative inline" },
  { label: "Simulate", detail: "Test before you spend" },
  { label: "Launch", detail: "Go live on OpenAI" },
];

const pricing = [
  {
    name: "Starter",
    price: 199,
    note: "1 workspace · up to $10K/mo spend",
    includes: "Drafting, 1 sim/day, reporting",
  },
  {
    name: "Growth",
    price: 599,
    note: "3 workspaces · up to $50K/mo spend",
    includes: "Unlimited sims, optimization, alerts",
  },
  {
    name: "Pro",
    price: 1999,
    note: "10 workspaces · up to $250K/mo spend",
    includes: "White-label, 5 seats, API access",
  },
];

type Phase = "intro" | "pause" | "move" | "reveal";

type FixedLogoPos = {
  top: string;
  left: string;
  x: string;
  y: string;
};

const CENTER_POS: FixedLogoPos = {
  top: "50%",
  left: "50%",
  x: "-50%",
  y: "-50%",
};

export function MarketingLandingPage() {
  const anchorRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(false);

  const [phase, setPhase] = useState<Phase>("intro");
  const [showPeriod, setShowPeriod] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [logoFixed, setLogoFixed] = useState(true);
  const [fixedPos, setFixedPos] = useState<FixedLogoPos>(CENTER_POS);
  const [backdropVisible, setBackdropVisible] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setShowPeriod(true);
      setPhase("reveal");
      setContentVisible(true);
      setLogoFixed(false);
      setBackdropVisible(false);
      return;
    }

    const timers = [
      setTimeout(() => setShowPeriod(true), 650),
      setTimeout(() => setPhase("pause"), 1300),
      setTimeout(() => setPhase("move"), 2100),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  useLayoutEffect(() => {
    if (phase !== "move" || !anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    setFixedPos({
      top: `${rect.top}px`,
      left: `${rect.left + rect.width / 2}px`,
      x: "-50%",
      y: "0",
    });
    setBackdropVisible(false);
  }, [phase]);

  useEffect(() => {
    if (phase !== "move") return;

    const fallback = setTimeout(() => {
      if (settledRef.current) return;
      settledRef.current = true;
      setLogoFixed(false);
      setPhase("reveal");
      requestAnimationFrame(() => setContentVisible(true));
    }, 850);

    return () => clearTimeout(fallback);
  }, [phase]);

  const handleLogoTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (phase !== "move" || settledRef.current) return;
    if (event.propertyName !== "top") return;

    settledRef.current = true;
    setLogoFixed(false);
    setPhase("reveal");
    requestAnimationFrame(() => setContentVisible(true));
  };

  const showBackdrop = backdropVisible && phase !== "reveal";

  return (
    <div className="min-h-screen bg-zinc-50">
      {showBackdrop ? (
        <div
          className={`intro-backdrop fixed inset-0 z-10 bg-zinc-50 ${
            phase === "move" ? "intro-backdrop-out" : ""
          }`}
          aria-hidden
        />
      ) : null}

      <section className="relative z-20 flex flex-col items-center px-6 pb-16 pt-20 text-center sm:pb-20 sm:pt-28">
        <div
          ref={anchorRef}
          className="flex min-h-10 w-full justify-center sm:min-h-12"
        >
          <div
            className={logoFixed ? "intro-logo-fixed" : undefined}
            style={
              logoFixed
                ? {
                    top: fixedPos.top,
                    left: fixedPos.left,
                    transform: `translate(${fixedPos.x}, ${fixedPos.y})`,
                  }
                : undefined
            }
            onTransitionEnd={handleLogoTransitionEnd}
          >
            <Logo
              className="text-4xl sm:text-5xl"
              showPeriod={showPeriod}
              animate={phase === "intro" || phase === "pause"}
            />
          </div>
        </div>

        <div
          className={`mt-8 max-w-lg transition-all duration-500 ease-out ${
            contentVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <h1 className="text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl">
            Launch and optimize ChatGPT Ads in minutes
          </h1>
        </div>

        <div
          className={`mt-8 transition-all duration-500 ease-out ${
            contentVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: contentVisible ? "60ms" : "0ms" }}
        >
          <Link
            href="/signin"
            className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section
        className={`relative z-20 mx-auto max-w-4xl px-6 pb-20 transition-opacity duration-700 ease-out sm:pb-28 ${
          contentVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transitionDelay: contentVisible ? "120ms" : "0ms" }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {capabilities.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-6"
            >
              <h2 className="font-medium text-zinc-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {item.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="rounded-lg border border-zinc-200 bg-white p-5 text-center sm:p-6"
            >
              <span className="text-xs font-medium tabular-nums text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 font-medium text-zinc-900">{step.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-center text-sm font-medium text-zinc-900">
            Pricing
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {pricing.map((tier) => (
              <article
                key={tier.name}
                className="rounded-lg border border-zinc-200 bg-white p-6 text-center"
              >
                <p className="font-medium text-zinc-900">{tier.name}</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                  ${tier.price}
                  <span className="text-base font-normal text-zinc-500">
                    /mo
                  </span>
                </p>
                <p className="mt-2 text-xs text-zinc-500">{tier.note}</p>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  {tier.includes}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-zinc-500">
            Enterprise — custom.{" "}
            <a
              href="mailto:hello@getcontextads.com"
              className="text-zinc-700 underline-offset-2 hover:underline"
            >
              Contact us
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
