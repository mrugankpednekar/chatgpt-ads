import Link from "next/link";

import { Logo } from "@/components/marketing/logo";
import { CONTACT_EMAIL } from "@/lib/marketing";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Logo className="text-lg" />
        <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
          ContextAds is the optimization layer for OpenAI Ads Manager — draft,
          simulate, launch, and improve campaigns before budget goes to waste.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-zinc-900"
          >
            {CONTACT_EMAIL}
          </a>
          <Link href="/signin" className="hover:text-zinc-900">
            Sign in
          </Link>
        </div>
      </div>
      <div className="border-t border-zinc-200">
        <p className="mx-auto max-w-4xl px-6 py-6 text-xs text-zinc-400">
          © {year} ContextAds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
