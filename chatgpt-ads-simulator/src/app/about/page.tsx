import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { BOOK_DEMO_URL, TEAM_LINE } from "@/lib/marketing";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <MarketingNav />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600">
          <p>
            ContextAds is the optimization layer for OpenAI Ads Manager. Draft,
            simulate, launch, and improve campaigns before budget goes to waste.
          </p>
          <p>
            OpenAI&apos;s ChatGPT Ads went from launch to $100M annualized revenue
            in six weeks. Brands are spending on it, and most are flying blind:
            pick context hints, deploy, wait for a CSV to find out what happened.
          </p>
          <p>
            We simulate your campaign before you launch. Predict which hints
            surface, which creative wins, then push to OpenAI in one click and
            keep optimizing from real delivery.
          </p>
          <p>
            ContextAds came out of work at MIT on AI ad performance. The question
            is why brands burn money on emerging ad channels before knowing what
            works. ChatGPT Ads launched in February and hit $100M ARR in six
            weeks. We&apos;re building the optimization layer.
          </p>
          <p>
            We&apos;re in beta with early partners. Small team, direct support
            for every customer we onboard.
          </p>
        </div>
        <p className="mt-4 text-sm text-zinc-500">{TEAM_LINE}</p>
        <a
          href={BOOK_DEMO_URL}
          className="mt-8 inline-flex rounded-lg bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Book a 15-minute conversation
        </a>
        <p className="mt-6">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Back
          </Link>
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
