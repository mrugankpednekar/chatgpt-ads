"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";

export default function SignInPage() {
  const router = useRouter();
  const signIn = useAppStore((s) => s.signIn);
  const skipToDemo = useAppStore((s) => s.skipToDemo);
  const [email, setEmail] = useState("mrugank@hellobubble.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    signIn(email);
    await skipToDemo();
    toast.success("Signed in");
    router.push("/dashboard");
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white"
            />
          </div>
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
