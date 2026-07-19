"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import type { DemoUser } from "@/lib/types";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signIn = useAppStore((s) => s.signIn);
  const initializeWorkspace = useAppStore((s) => s.initializeWorkspace);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as {
        user?: DemoUser;
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Sign in failed.");
        return;
      }

      if (!data.user) {
        setError("Sign in failed.");
        return;
      }

      signIn(data.user);
      await initializeWorkspace();
      toast.success("Signed in");
      router.push(searchParams.get("next") ?? "/dashboard");
    } catch {
      setError("Unable to sign in. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo className="text-lg" />
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Access your ChatGPT Ads workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="surface space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
