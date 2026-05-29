"use client";

import Link from "next/link";
import {
  useLayoutEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";

import { Logo } from "@/components/marketing/logo";
import { BOOK_DEMO_URL } from "@/lib/marketing";

export type IntroPhase = "intro" | "pause" | "move" | "reveal" | "idle";

type MarketingNavProps = {
  visible?: boolean;
  introPhase?: IntroPhase;
  introScale?: number;
  showPeriod?: boolean;
  onIntroSettled?: () => void;
};

type FlyStyle = {
  top: string;
  left: string;
  transform: string;
  origin: "center" | "top-left";
};

function centerFlyStyle(introScale: number): FlyStyle {
  return {
    top: "50%",
    left: "50%",
    transform: `translate(-50%, -50%) scale(${introScale})`,
    origin: "center",
  };
}

export function MarketingNav({
  visible = true,
  introPhase = "idle",
  introScale = 2.35,
  showPeriod = true,
  onIntroSettled,
}: MarketingNavProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const settledRef = useRef(false);
  const introActive = introPhase !== "idle" && introPhase !== "reveal";
  const [isFlying, setIsFlying] = useState(introActive);
  const [flyStyle, setFlyStyle] = useState<FlyStyle>(() =>
    centerFlyStyle(introScale),
  );

  useLayoutEffect(() => {
    if (introPhase === "idle" || introPhase === "reveal") {
      setIsFlying(false);
      return;
    }

    settledRef.current = false;

    if (introPhase === "intro" || introPhase === "pause") {
      setIsFlying(true);
      setFlyStyle(centerFlyStyle(introScale));
      return;
    }

    if (introPhase === "move" && slotRef.current) {
      const rect = slotRef.current.getBoundingClientRect();
      setIsFlying(true);
      setFlyStyle({
        top: `${Math.round(rect.top)}px`,
        left: `${Math.round(rect.left)}px`,
        transform: "translate(0, 0) scale(1)",
        origin: "top-left",
      });
    }
  }, [introPhase, introScale]);

  useLayoutEffect(() => {
    if (introPhase !== "move") return;

    const fallback = window.setTimeout(() => {
      if (settledRef.current) return;
      settledRef.current = true;
      setIsFlying(false);
      requestAnimationFrame(() => onIntroSettled?.());
    }, 900);

    return () => window.clearTimeout(fallback);
  }, [introPhase, onIntroSettled]);

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (introPhase !== "move" || settledRef.current) return;
    if (event.propertyName !== "transform") return;

    settledRef.current = true;
    setIsFlying(false);
    requestAnimationFrame(() => onIntroSettled?.());
  };

  const flying = isFlying && introActive;

  return (
    <nav
      className={`relative z-40 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        ref={slotRef}
        className="flex min-h-9 min-w-[8.5rem] items-center"
        aria-hidden={flying}
      >
        <div
          className={
            flying
              ? `intro-logo-fixed z-30 ${
                  flyStyle.origin === "center"
                    ? "intro-logo-origin-center"
                    : "intro-logo-origin-top-left"
                }`
              : undefined
          }
          style={
            flying
              ? {
                  top: flyStyle.top,
                  left: flyStyle.left,
                  transform: flyStyle.transform,
                }
              : undefined
          }
          onTransitionEnd={handleTransitionEnd}
        >
          <Link href="/" aria-label="ContextAds home" tabIndex={flying ? -1 : 0}>
            <Logo
              className="text-lg sm:text-xl"
              showPeriod={showPeriod}
              animate={introPhase === "intro"}
            />
          </Link>
        </div>
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
