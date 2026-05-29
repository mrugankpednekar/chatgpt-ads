import Link from "next/link";
import {
  Cpu,
  Heart,
  Home,
  Shirt,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { HeroProductPreview } from "@/components/marketing/hero-product-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { BOOK_DEMO_URL, CONTACT_EMAIL, FOUNDER } from "@/lib/marketing";

const categories = [
  { icon: Sparkles, label: "Beauty & Skincare" },
  { icon: Heart, label: "Supplements" },
  { icon: Shirt, label: "DTC Fashion" },
  { icon: Home, label: "Home & Lifestyle" },
  { icon: Cpu, label: "B2B SaaS" },
  { icon: UtensilsCrossed, label: "Food & Beverage" },
];

const features = [
  {
    title: "AI-drafted campaigns",
    body: "One sentence in. Full campaign out — hints, creative, bids — structured for OpenAI.",
  },
  {
    title: "Pre-spend simulation",
    body: "Score hints against synthetic ChatGPT conversations before budget goes live.",
  },
  {
    title: "One-click launch",
    body: "Draft, validate, and push to OpenAI Ads in under a minute.",
  },
  {
    title: "Continuous optimization",
    body: "Pause dead ads and shift budget to winners from real delivery data.",
  },
];

const marketStats = [
  {
    value: "$100M ARR",
    sub: "in 6 weeks",
    body: "OpenAI's ChatGPT Ads pilot reached $100M annualized revenue within six weeks of its February 2026 launch.",
    source: "OpenAI, March 2026",
  },
  {
    value: "900M",
    sub: "weekly users",
    body: "Most US ChatGPT users are ad-eligible. Inventory is constrained — optimization matters.",
    source: "OpenAI, Q1 2026",
  },
  {
    value: "44%",
    sub: "retail share",
    body: "Retail and grocery dominate early ChatGPT Ads impressions.",
    source: "Sensor Tower",
  },
];

const methodology = [
  {
    step: "01",
    title: "Persona generation",
    body: "200+ realistic shoppers for your category — intent, budget, demographics.",
  },
  {
    step: "02",
    title: "Conversation simulation",
    body: "Multi-turn queries grounded in real model behavior, not templated text.",
  },
  {
    step: "03",
    title: "Hint scoring",
    body: "Relevance, intent, and fit scored against every conversation.",
  },
  {
    step: "04",
    title: "Calibration",
    body: "Predicted vs. actual after launch. Each campaign improves the next.",
  },
];

const faqs = [
  {
    q: "Do I need an OpenAI Ads account?",
    a: "Yes. You connect your API key. We draft and launch on your account — you keep spend and ownership.",
  },
  {
    q: "How accurate are predictions?",
    a: "We score hints against synthetic conversations modeled on OpenAI's auction signals. You edit before spend, then compare predicted vs. actual after launch.",
  },
  {
    q: "What if OpenAI rejects my campaign?",
    a: "Preflight checks on specs and landing pages run before submission. You approve every field.",
  },
  {
    q: "Do you see ChatGPT conversation data?",
    a: "No. Simulations are synthetic. We only use your Ads API for launch and reporting.",
  },
  {
    q: "Who is this for?",
    a: "Mid-market DTC and agencies running ChatGPT Ads — skincare, supplements, fashion, SaaS.",
  },
  {
    q: "Can I try without a call?",
    a: "Design partners get a free first-campaign simulation. Book a demo for access.",
  },
];

export function MarketingLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <MarketingNav />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-14 pt-4 lg:pb-16">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              Closed beta — design partners
            </div>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Launch and optimize
              <br />
              ChatGPT Ads in minutes
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-600">
              OpenAI opened Ads Manager to all US advertisers in May 2026. Most
              brands lose first-month spend on context hints that never match.
              We&apos;re the optimization layer.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={BOOK_DEMO_URL}
                className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Book a demo
              </a>
              <Link
                href="/signin"
                className="rounded-lg px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Try the simulator →
              </Link>
            </div>
            <p className="mt-5 text-xs text-zinc-500">
              Built by {FOUNDER.name} — MIT researcher on AI ad performance,
              previously Wayward and Balyasny.
            </p>
          </div>
          <HeroProductPreview />
        </div>
      </section>

      {/* Categories */}
      <section className="border-y border-zinc-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-zinc-400">
            Built for mid-market DTC and B2B SaaS
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <Icon className="size-4 text-zinc-400" strokeWidth={1.5} />
                <span className="text-xs text-zinc-600">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {marketStats.map((stat) => (
            <article
              key={stat.value}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <p className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-500">{stat.sub}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {stat.body}
              </p>
              <p className="mt-3 text-[11px] text-zinc-400">{stat.source}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <h2 className="font-semibold text-zinc-900">{f.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-200 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-center text-xl font-semibold tracking-tight">
            How it works
          </h2>
          <div className="relative">
            <div className="absolute left-[12%] right-[12%] top-6 hidden h-px bg-zinc-200 md:block" />
            <div className="grid gap-8 md:grid-cols-4">
              {[
                { num: "01", title: "Describe", body: "Campaign, budget, audience" },
                { num: "02", title: "Edit", body: "Hints and creative inline" },
                { num: "03", title: "Simulate", body: "Predicted match rates" },
                { num: "04", title: "Launch", body: "Push live to OpenAI" },
              ].map((s) => (
                <div key={s.num} className="relative text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-500">
                    {s.num}
                  </div>
                  <p className="font-semibold text-zinc-900">{s.title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="border-t border-zinc-200 bg-white py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-xl font-semibold tracking-tight">
              How the simulation works
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Agent simulation research from MIT — not a black box.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methodology.map((m) => (
              <article key={m.step} className="rounded-xl border border-zinc-200 p-5">
                <p className="font-mono text-xs text-zinc-400">{m.step}</p>
                <h3 className="mt-2 font-semibold text-zinc-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {m.body}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link
              href="/methodology"
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Read the full methodology →
            </Link>
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-zinc-200 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex max-w-xl items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              MP
            </div>
            <div>
              <p className="font-semibold text-zinc-900">{FOUNDER.name}</p>
              <p className="text-sm text-zinc-500">
                {FOUNDER.role}, ContextAds
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                MIT MBAn &apos;26. Researches AI ad performance. Previously
                Wayward ($2B GMV adtech) and Balyasny.
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <a
                  href={FOUNDER.linkedin}
                  className="text-zinc-600 hover:text-zinc-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href={FOUNDER.github}
                  className="text-zinc-600 hover:text-zinc-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-zinc-200 py-14">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold tracking-tight">Pricing</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Closed beta. Free first-campaign simulation for design partners.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <article className="flex flex-col rounded-xl border border-zinc-200 bg-white p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Design partner
              </p>
              <p className="mt-2 text-3xl font-semibold">Free</p>
              <p className="text-sm text-zinc-600">First campaign simulation</p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-700">
                <li>Full draft + simulation</li>
                <li>Direct founder support</li>
                <li>Shape what we build next</li>
              </ul>
              <a
                href={BOOK_DEMO_URL}
                className="mt-6 block rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-800"
              >
                Apply for early access
              </a>
            </article>
            <article className="relative flex flex-col rounded-xl border-2 border-emerald-200 bg-white p-6">
              <span className="absolute -top-2.5 left-6 rounded bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">
                Most popular
              </span>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Growth
              </p>
              <p className="mt-2 text-3xl font-semibold">
                $599
                <span className="text-base font-normal text-zinc-500">/mo</span>
              </p>
              <p className="text-sm text-zinc-600">
                3 workspaces · up to $50K/mo spend
              </p>
              <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-700">
                <li>Unlimited simulations</li>
                <li>Optimization rules</li>
                <li>Predicted vs. actual reporting</li>
              </ul>
              <a
                href={BOOK_DEMO_URL}
                className="mt-6 block rounded-lg bg-emerald-600 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700"
              >
                Book a demo
              </a>
            </article>
          </div>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Need more?{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Enterprise%20pricing`}
              className="font-medium text-zinc-900 underline-offset-2 hover:underline"
            >
              Contact sales
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200 py-14">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-center text-xl font-semibold tracking-tight">
            FAQ
          </h2>
          <dl className="grid gap-x-10 gap-y-8 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="text-sm font-semibold text-zinc-900">{item.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
