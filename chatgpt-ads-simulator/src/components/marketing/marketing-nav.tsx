"use client";

import Link from "next/link";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

import { Logo } from "@/components/marketing/logo";
import { BOOK_DEMO_URL } from "@/lib/marketing";

export type IntroPhase = "intro" | "pause" | "move" | "reveal" | "idle";

type MarketingNavProps = {
  navLinksVisible?: boolean;
  introPhase?: IntroPhase;
  introScale?: number;
  showPeriod?: boolean;
  onIntroSettled?: () => void;
};

type HomePos = { top: number; left: number };

export function MarketingNav({
  navLinksVisible = true,
  introPhase = "idle",
  introScale = 2.35,
  showPeriod = true,
  onIntroSettled,
}: MarketingNavProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(false);
  const centerTransformRef = useRef("");

  const introActive = introPhase !== "idle" && introPhase !== "reveal";
  const [settled, setSettled] = useState(!introActive);
  const [homePos, setHomePos] = useState<HomePos | null>(null);
  const [flyTransform, setFlyTransform] = useState<string | null>(null);
  const [flyTransition, setFlyTransition] = useState(false);

  const measureHome = useCallback((): HomePos | null => {
    const slot = slotRef.current;
    if (!slot) return null;
    const rect = slot.getBoundingClientRect();
    return { top: Math.round(rect.top), left: Math.round(rect.left) };
  }, []);

  const computeCenterTransform = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return "translate(0, 0) scale(1)";

    const rect = slot.getBoundingClientRect();
    const dx = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const dy = window.innerHeight / 2 - (rect.top + rect.height / 2);

    return `translate(${dx}px, ${dy}px) scale(${introScale})`;
  }, [introScale]);

  useLayoutEffect(() => {
    const home = measureHome();
    if (home) setHomePos(home);
  }, [measureHome]);

  useLayoutEffect(() => {
    if (introPhase === "idle" || introPhase === "reveal") {
      setSettled(true);
      setFlyTransform(null);
      setFlyTransition(false);
      return;
    }

    settledRef.current = false;
    setSettled(false);

    if (introPhase === "intro" || introPhase === "pause") {
      const center = computeCenterTransform();
      centerTransformRef.current = center;
      setFlyTransition(false);
      setFlyTransform(center);
      return;
    }

    if (introPhase === "move") {
      const center = centerTransformRef.current || computeCenterTransform();
      centerTransformRef.current = center;
      setFlyTransition(false);
      setFlyTransform(center);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlyTransition(true);
          setFlyTransform("translate(0, 0) scale(1)");
        });
      });
    }
  }, [introPhase, computeCenterTransform]);

  useLayoutEffect(() => {
    if (introPhase !== "move") return;

    const fallback = window.setTimeout(() => {
      if (settledRef.current) return;
      settledRef.current = true;
      setFlyTransition(false);
      setFlyTransform(null);
      setSettled(true);
      onIntroSettled?.();
    }, 900);

    return () => window.clearTimeout(fallback);
  }, [introPhase, onIntroSettled]);

  const handleFlyEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (introPhase !== "move" || settledRef.current) return;
    if (event.propertyName !== "transform") return;

    settledRef.current = true;
    setFlyTransition(false);
    setFlyTransform(null);
    setSettled(true);
    onIntroSettled?.();
  };

  const showFlyer = introActive && homePos !== null && flyTransform !== null;

  return (
    <nav className="relative z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <div ref={slotRef} className="flex min-h-9 min-w-[8.5rem] items-center">
        <div className={settled ? "opacity-100" : "pointer-events-none opacity-0"}>
          <Link href="/" aria-label="ContextAds home">
            <Logo className="text-lg sm:text-xl" showPeriod={showPeriod} />
          </Link>
        </div>
      </div>

      {showFlyer ? (
        <div
          className={`intro-logo-fly fixed z-50 origin-center ${
            flyTransition ? "intro-logo-fly-active" : ""
          }`}
          style={{
            top: homePos.top,
            left: homePos.left,
            transform: flyTransform,
          }}
          onTransitionEnd={handleFlyEnd}
        >
          <Logo
            className="text-lg sm:text-xl"
            showPeriod={showPeriod}
            animate={introPhase === "intro"}
          />
        </div>
      ) : null}

      <div
        className={`flex items-center gap-4 transition-opacity duration-500 sm:gap-6 ${
          navLinksVisible && settled
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
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
