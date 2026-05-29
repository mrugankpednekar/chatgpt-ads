"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Logo } from "@/components/marketing/logo";
import { SimulationPreview } from "@/components/marketing/simulation-preview";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { BOOK_DEMO_URL } from "@/lib/marketing";

const capabilities = [
  {
    title: "AI-drafted campaigns",
    body: "Type one sentence about your product. Get a full campaign — context hints, creative variants, and bid structure — aligned to OpenAI's best practices.",
  },
  {
    title: "Pre-spend simulation",
    body: "We simulate your campaign across hundreds of synthetic ChatGPT conversations to predict which context hints will deliver impressions — before you spend a dollar.",
  },
  {
    title: "One-click launch",
    body: "Skip the manual setup in Ads Manager. Describe your campaign, we draft and validate, and push to OpenAI Ads in under a minute.",
  },
  {
    title: "Continuous optimization",
    body: "Pause dead ads, shift budget toward winners, and recalibrate from real performance — without living in a spreadsheet.",
  },
];

const steps = [
  { label: "Describe", detail: "Campaign, budget, audience" },
  { label: "Edit", detail: "Hints and creative inline" },
  { label: "Simulate", detail: "See predicted match rates" },
  { label: "Launch", detail: "Push live to OpenAI" },
];

const pricing = [
  {
    name: "Design partner",
    price: "Free",
    period: "first campaign",
    note: "In closed beta with select brands",
    includes:
      "Full draft + simulation for your first campaign. Apply for early access.",
    cta: "Book a demo",
    href: BOOK_DEMO_URL,
    primary: true,
  },
  {
    name: "Growth",
    price: "$599",
    period: "/mo",
    note: "3 workspaces · up to $50K/mo spend",
    includes:
      "Unlimited simulations and optimization. Most brands recoup the fee by avoiding wasted spend on dead hints in month one.",
    cta: "Book a demo",
    href: BOOK_DEMO_URL,
    primary: false,
  },
];

const faqs = [
  {
    q: "Do I need an existing OpenAI Ads account?",
    a: "Yes. ContextAds connects to your OpenAI Ads API key. We draft, simulate, and launch on your behalf — you keep ownership of the account and spend.",
  },
  {
    q: "How accurate are your predictions?",
    a: "Simulations score context hints against synthetic conversations modeled on OpenAI's auction signals. We show predicted match rates and intent quality so you can edit before spend — then compare predicted vs. actual after launch.",
  },
  {
    q: "What if OpenAI rejects my campaign?",
    a: "We run preflight checks on character limits, creative specs, and landing pages before anything is submitted. You review and edit every field before launch.",
  },
  {
    q: "Do you see my ChatGPT conversation data?",
    a: "No. We generate synthetic conversations for simulation and use your Ads API for launch and reporting. We do not access end-user ChatGPT chats.",
  },
  {
    q: "What categories does this work for?",
    a: "Built for mid-market DTC — skincare, supplements, fashion, and SaaS — anywhere context hints and creative quality drive ChatGPT Ads performance.",
  },
  {
    q: "Can I try it without a sales call?",
    a: "Design partners get a free first-campaign simulation. Book a demo and we'll set up access — or sign in if you already have an account.",
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
  const showContent = contentVisible;

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader visible={showContent} />

      {showBackdrop ? (
        <div
          className={`intro-backdrop fixed inset-0 z-10 bg-zinc-50 ${
            phase === "move" ? "intro-backdrop-out" : ""
          }`}
          aria-hidden
        />
      ) : null}

      <section className="relative z-20 flex flex-col items-center px-6 pb-12 pt-20 text-center sm:pb-16 sm:pt-28">
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
          className={`mt-8 max-w-2xl transition-all duration-500 ease-out ${
            showContent
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <h1 className="text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl">
            Launch and optimize ChatGPT Ads in minutes
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Built by MIT MBAn researchers working on AI ad performance.
            Currently onboarding design-partner brands.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            OpenAI opened Ads Manager to all US advertisers in May 2026. Early
            advertisers report significant first-month spend on context hints
            that never match. We&apos;re the optimization layer.
          </p>
        </div>

        <div
          className={`mt-8 flex flex-wrap items-center justify-center gap-3 transition-all duration-500 ease-out ${
            showContent
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: showContent ? "60ms" : "0ms" }}
        >
          <a
            href={BOOK_DEMO_URL}
            className="inline-flex h-11 items-center justify-center rounded-md bg-emerald-600 px-8 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Book a demo
          </a>
          <Link
            href="/signin"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
          >
            Try the simulator
          </Link>
        </div>
      </section>

      <section
        className={`relative z-20 mx-auto max-w-4xl px-6 transition-opacity duration-700 ease-out ${
          showContent ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transitionDelay: showContent ? "120ms" : "0ms" }}
      >
        <div className="mb-12">
          <SimulationPreview />
          <p className="mt-3 text-center text-xs text-zinc-500">
            Synthetic conversations and hint scores update before you commit
            budget.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {capabilities.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 text-left"
            >
              <h2 className="font-medium text-zinc-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
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
          <h2 className="mb-2 text-center text-sm font-medium text-zinc-900">
            Pricing
          </h2>
          <p className="mb-6 text-center text-sm text-zinc-500">
            In closed beta with select brands. Start with a free first-campaign
            simulation.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {pricing.map((tier) => (
              <article
                key={tier.name}
                className={`flex flex-col rounded-lg border bg-white p-6 text-left ${
                  tier.primary
                    ? "border-zinc-900 ring-1 ring-zinc-900"
                    : "border-zinc-200"
                }`}
              >
                <p className="font-medium text-zinc-900">{tier.name}</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                  {tier.price}
                  {tier.period ? (
                    <span className="text-base font-normal text-zinc-500">
                      {" "}
                      {tier.period}
                    </span>
                  ) : null}
                </p>
                <p className="mt-2 text-xs text-zinc-500">{tier.note}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600">
                  {tier.includes}
                </p>
                <a
                  href={tier.href}
                  className={`mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${
                    tier.primary
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "border border-zinc-200 text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  {tier.cta}
                </a>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Need more?{" "}
            <a
              href="mailto:hi@getcontextads.com?subject=Enterprise%20pricing"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Contact sales
            </a>{" "}
            for multi-workspace and agency plans.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-center text-sm font-medium text-zinc-900">
            FAQ
          </h2>
          <dl className="space-y-4">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="rounded-lg border border-zinc-200 bg-white p-5 text-left"
              >
                <dt className="font-medium text-zinc-900">{item.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
