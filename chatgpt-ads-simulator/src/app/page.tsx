import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          ContextAds
        </h1>
        <p className="mt-2 text-lg text-zinc-600">
          Launch ChatGPT Ads in minutes
        </p>
        <p className="mt-4 text-lg text-zinc-600">
          AI-drafted campaigns, pre-spend simulation, and one-click launch.
        </p>
        <div className="mt-8">
          <Link href="/signin">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
