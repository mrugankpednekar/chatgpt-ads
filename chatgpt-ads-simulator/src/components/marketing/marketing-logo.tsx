"use client";

import Image from "next/image";
import { useState } from "react";

import {
  MARKETING_LOGO_FILES,
  type MarketingLogoId,
} from "@/lib/marketing-logos";

type MarketingLogoProps = {
  id: MarketingLogoId;
  width: number;
  height: number;
  className?: string;
};

export function MarketingLogo({
  id,
  width,
  height,
  className = "",
}: MarketingLogoProps) {
  const { primary, fallback, alt } = MARKETING_LOGO_FILES[id];
  const [src, setSrc] = useState<string>(primary);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
    />
  );
}
