import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { CONTACT_EMAIL } from "@/lib/marketing";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <MarketingNav />
      <main className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Methodology</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-600">
          <p>
            ContextAds scores context hints before spend using synthetic ChatGPT
            conversations generated from category-specific personas — intent
            stage, demographics, and budget sensitivity included.
          </p>
          <p>
            Each hint is evaluated on topical relevance, intent alignment, and
            natural fit against hundreds of conversations. Scores reflect
            predicted surfacing under OpenAI&apos;s relevance-weighted auction,
            not generic NLP similarity.
          </p>
          <p>
            After launch, we compare predicted match rates to actual delivery.
            Calibration data from each campaign improves scoring for the next.
            Detailed methodology paper coming soon.
          </p>
        </div>
        <p className="mt-8 text-sm">
          Early access:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Methodology%20paper`}
            className="font-medium text-zinc-900 underline-offset-2 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
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
