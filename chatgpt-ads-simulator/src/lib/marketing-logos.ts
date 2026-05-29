/**
 * Drop logo files into public/logos/ using these exact filenames.
 * PNG or SVG both work. PNG is preferred for photographic marks.
 */
export const MARKETING_LOGO_FILES = {
  openai: {
    primary: "/logos/openai.png",
    fallback: "/logos/openai.svg",
    alt: "OpenAI",
  },
  sensorTower: {
    primary: "/logos/sensor-tower.png",
    fallback: "/logos/sensor-tower.svg",
    alt: "Sensor Tower",
  },
  mit: {
    primary: "/logos/mit.png",
    fallback: "/logos/mit.svg",
    alt: "MIT",
  },
  balyasny: {
    primary: "/logos/balyasny.png",
    fallback: "/logos/balyasny.svg",
    alt: "Balyasny Asset Management",
  },
} as const;

export type MarketingLogoId = keyof typeof MARKETING_LOGO_FILES;
