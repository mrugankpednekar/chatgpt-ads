"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
      </div>
    );
  }

  return children;
}
