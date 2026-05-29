import Link from "next/link";

import { BOOK_DEMO_URL } from "@/lib/marketing";

export function MarketingNav() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
        ContextAds<span className="text-emerald-600">.</span>
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        <Link
          href="/about"
          className="hidden text-sm text-zinc-600 hover:text-zinc-900 sm:inline"
        >
          About
        </Link>
        <Link
          href="/signin"
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          Sign in
        </Link>
        <a
          href={BOOK_DEMO_URL}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Book a demo
        </a>
      </div>
    </nav>
  );
}
