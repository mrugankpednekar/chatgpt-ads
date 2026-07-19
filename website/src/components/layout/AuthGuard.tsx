"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppStore } from "@/lib/store";
import type { DemoUser } from "@/lib/types";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const signIn = useAppStore((s) => s.signIn);
  const signOut = useAppStore((s) => s.signOut);
  const initializeWorkspace = useAppStore((s) => s.initializeWorkspace);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const response = await fetch("/api/auth/session");
        const data = (await response.json()) as {
          authenticated: boolean;
          user?: DemoUser;
        };

        if (cancelled) return;

        if (data.authenticated && data.user) {
          signIn(data.user);
          await initializeWorkspace();
          setChecked(true);
          return;
        }

        signOut();
        router.replace("/signin");
      } catch {
        if (!cancelled) {
          signOut();
          router.replace("/signin");
        }
      }
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [initializeWorkspace, router, signIn, signOut]);

  if (!checked || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
      </div>
    );
  }

  return children;
}
