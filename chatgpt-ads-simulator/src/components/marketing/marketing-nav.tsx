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

export function MarketingNav({
  navLinksVisible = true,
  introPhase = "idle",
  introScale = 2.35,
  showPeriod = true,
  onIntroSettled,
}: MarketingNavProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const centerTransformRef = useRef<string>("");
  const settledRef = useRef(false);
  const introActive = introPhase !== "idle" && introPhase !== "reveal";

  const [transform, setTransform] = useState<string | null>(
    introPhase === "idle" || introPhase === "reveal" ? "none" : null,
  );
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const computeCenterTransform = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return "none";

    const rect = el.getBoundingClientRect();
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;

    return `translate(${cx - ox}px, ${cy - oy}px) scale(${introScale})`;
  }, [introScale]);

  useLayoutEffect(() => {
    if (introPhase === "idle" || introPhase === "reveal") {
      setTransitionEnabled(false);
      setTransform("none");
      return;
    }

    if (introPhase === "intro" || introPhase === "pause") {
      settledRef.current = false;
      setTransitionEnabled(false);
      const center = computeCenterTransform();
      centerTransformRef.current = center;
      setTransform(center);
      return;
    }

    if (introPhase === "move") {
      settledRef.current = false;
      setTransitionEnabled(false);
      setTransform(centerTransformRef.current || computeCenterTransform());

      const startMove = () => {
        setTransitionEnabled(true);
        setTransform("none");
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(startMove);
      });
    }
  }, [introPhase, computeCenterTransform]);

  useLayoutEffect(() => {
    if (introPhase !== "move") return;

    const fallback = window.setTimeout(() => {
      if (settledRef.current) return;
      settledRef.current = true;
      setTransitionEnabled(false);
      onIntroSettled?.();
    }, 900);

    return () => window.clearTimeout(fallback);
  }, [introPhase, onIntroSettled]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (introPhase !== "move" || settledRef.current) return;
    if (event.propertyName !== "transform") return;

    settledRef.current = true;
    setTransitionEnabled(false);
    onIntroSettled?.();
  };

  const logoVisible = !introActive || transform !== null;

  return (
    <nav className="relative z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <div className="flex min-h-9 min-w-[8.5rem] items-center">
        <div
          ref={wrapRef}
          className={`origin-center ${
            introActive ? "relative z-50" : ""
          } ${transitionEnabled ? "intro-logo-transform" : ""} ${
            logoVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: transform ?? "none" }}
          onTransitionEnd={handleTransitionEnd}
        >
          <Link
            href="/"
            aria-label="ContextAds home"
            tabIndex={introActive ? -1 : 0}
          >
            <Logo
              className="text-lg sm:text-xl"
              showPeriod={showPeriod}
              animate={introPhase === "intro"}
            />
          </Link>
        </div>
      </div>
      <div
        className={`flex items-center gap-4 transition-opacity duration-500 sm:gap-6 ${
          navLinksVisible && !introActive
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
