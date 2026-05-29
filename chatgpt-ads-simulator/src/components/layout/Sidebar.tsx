"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Megaphone, Plus } from "lucide-react";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/campaigns/new", label: "Create campaign", icon: Plus },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const brand = useAppStore((s) => s.brand);

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col bg-zinc-900 text-zinc-100">
      <div className="border-b border-zinc-800 px-4 py-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="flex w-full text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{brand.name}</p>
            <p className="truncate text-xs text-zinc-400">Workspace</p>
          </div>
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-zinc-800 font-medium text-white"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-zinc-800 p-3">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-zinc-200">
              {user.name}
            </p>
            <p className="truncate text-xs text-zinc-500">{user.role}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

export function TopNav({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold tracking-tight text-zinc-900">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
