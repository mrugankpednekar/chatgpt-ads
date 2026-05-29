import Link from "next/link";

import { CONTACT_EMAIL } from "@/lib/marketing";

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <p className="text-sm text-zinc-600">
          <span className="font-semibold text-zinc-900">ContextAds.</span> The
          optimization layer for OpenAI Ads.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
          <Link href="/about" className="hover:text-zinc-900">
            About
          </Link>
          <Link href="/methodology" className="hover:text-zinc-900">
            Methodology
          </Link>
          <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-zinc-900">
            {CONTACT_EMAIL}
          </a>
          <Link href="/signin" className="hover:text-zinc-900">
            Sign in
          </Link>
          <span className="text-zinc-400">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
