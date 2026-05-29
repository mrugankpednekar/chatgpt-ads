"use client";

import Link from "next/link";

export function SiteHeader({ visible }: { visible: boolean }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-end px-6">
        <Link
          href="/signin"
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}
