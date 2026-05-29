/**
 * Logo assets live in public/logos/.
 * Update primary paths when new brand files are added.
 */
export const MARKETING_LOGO_FILES = {
  openai: {
    primary: "/logos/OpenAI_Logo.svg.png",
    fallback: "/logos/openai.svg",
    alt: "OpenAI",
  },
  sensorTower: {
    primary: "/logos/5b18bcefcf2cd7a3b7bf0c8dc110.png",
    fallback: "/logos/5b18bcefcf2cd7a3b7bf0c8dc110.png",
    alt: "Sensor Tower",
  },
  mit: {
    primary: "/logos/logo-colors-mit-red.png",
    fallback: "/logos/mit.svg",
    alt: "MIT",
  },
  balyasny: {
    primary: "/logos/Balyasny_Logo_RGB.svg",
    fallback: "/logos/balyasny.svg",
    alt: "Balyasny Asset Management",
  },
} as const;

export type MarketingLogoId = keyof typeof MARKETING_LOGO_FILES;
