/**
 * Logo assets live in public/logos/.
 */
export const MARKETING_LOGO_FILES = {
  openai: {
    primary: "/logos/OpenAI_Logo.svg.png",
    fallback: "/logos/OpenAI_Logo.svg.png",
    alt: "OpenAI",
    displayClassName: "h-7 w-auto max-h-7 max-w-[7.5rem] object-contain",
    intrinsicWidth: 184,
    intrinsicHeight: 50,
  },
  sensorTower: {
    primary: "/logos/5b18bcefcf2cd7a3b7bf0c8dc110.png",
    fallback: "/logos/5b18bcefcf2cd7a3b7bf0c8dc110.png",
    alt: "Sensor Tower",
    displayClassName: "h-6 w-auto max-h-6 max-w-[9rem] object-contain",
    intrinsicWidth: 220,
    intrinsicHeight: 44,
  },
  mit: {
    primary: "/logos/logo-colors-mit-red.png",
    fallback: "/logos/mit.svg",
    alt: "MIT",
    displayClassName: "h-9 w-auto max-h-9 max-w-[4.5rem] object-contain",
    intrinsicWidth: 96,
    intrinsicHeight: 96,
  },
  balyasny: {
    primary: "/logos/Balyasny_Logo_RGB.svg",
    fallback: "/logos/balyasny.svg",
    alt: "Balyasny Asset Management",
    displayClassName: "h-5 w-auto max-h-5 max-w-[8rem] object-contain",
    intrinsicWidth: 160,
    intrinsicHeight: 36,
  },
} as const;

export type MarketingLogoId = keyof typeof MARKETING_LOGO_FILES;
