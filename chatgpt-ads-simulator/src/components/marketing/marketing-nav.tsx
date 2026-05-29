"use client";

import Link from "next/link";
import { type RefObject } from "react";

import { Logo } from "@/components/marketing/logo";
import { BOOK_DEMO_URL } from "@/lib/marketing";

type MarketingNavProps = {
  visible?: boolean;
  logoAnchorRef?: RefObject<HTMLDivElement | null>;
  showNavLogo?: boolean;
  showPeriod?: boolean;
};

export function MarketingNav({
  visible = true,
  logoAnchorRef,
  showNavLogo = true,
  showPeriod = true,
}: MarketingNavProps) {
  return (
    <nav
      className={`relative z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div ref={logoAnchorRef} className="flex min-h-9 min-w-[8.5rem] items-center">
        {showNavLogo ? (
          <Link href="/" aria-label="ContextAds home">
            <Logo className="text-lg sm:text-xl" showPeriod={showPeriod} />
          </Link>
        ) : null}
      </div>
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
