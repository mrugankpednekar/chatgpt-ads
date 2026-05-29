"use client";

import Image from "next/image";
import { useState } from "react";

import {
  MARKETING_LOGO_FILES,
  type MarketingLogoId,
} from "@/lib/marketing-logos";

type MarketingLogoProps = {
  id: MarketingLogoId;
  className?: string;
};

export function MarketingLogo({ id, className = "" }: MarketingLogoProps) {
  const logo = MARKETING_LOGO_FILES[id];
  const [src, setSrc] = useState<string>(logo.primary);

  return (
    <Image
      src={src}
      alt={logo.alt}
      width={logo.intrinsicWidth}
      height={logo.intrinsicHeight}
      unoptimized
      className={`${logo.displayClassName} ${className}`.trim()}
      onError={() => {
        if (src !== logo.fallback) setSrc(logo.fallback);
      }}
    />
  );
}
