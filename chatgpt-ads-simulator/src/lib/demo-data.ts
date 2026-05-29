import type {
  BrandInput,
  BrandProfile,
  CampaignDraft,
  DemoUser,
  PlatformCampaign,
} from "./types";
import { isDefaultBrief } from "./types";

export const DEMO_MODE_ENABLED =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const SKIP_DEMO_CACHE =
  process.env.NEXT_PUBLIC_SKIP_DEMO_CACHE === "true";

export const DEMO_BRAND: BrandProfile = {
  id: "brand_bubble_001",
  name: "Bubble Skincare",
  url: "https://hellobubble.com",
  category: "DTC skincare, Gen Z target",
  priceRange: "$10-30",
  description:
    "Affordable, dermatologist-developed skincare for Gen Z and young millennials. Hero products: gentle cleansers, hydrating moisturizers, lightweight serums.",
  targetCustomer:
    "Teens and young adults (16-28) with sensitive, combo, or acne-prone skin. Budget-conscious, anti-influencer, science-curious.",
  brandVoice: ["friendly", "scientific", "minimal"],
  excludedTopics:
    "Don't reference competitors by name. Avoid making medical claims.",
  logoUrl: "/brand-assets/bubble-logo.svg",
  brandColors: { primary: "#FF6B9D", secondary: "#2E2E2E" },
  openAIAdsConnected: true,
  pixelInstalled: true,
  monthlyAdSpend: 12500,
};

export const DEMO_USER: DemoUser = {
  id: "user_001",
  name: "Mrugank Pednekar",
  email: "mrugank@hellobubble.com",
  role: "Marketing Lead",
  workspaceName: "Bubble Skincare",
};

export const DEFAULT_CAMPAIGN_BRIEF =
  "Launch our Vitamin C serum to Gen Z, $1500/month, drive purchases";

export const EXAMPLE_BRIEFS = [
  DEFAULT_CAMPAIGN_BRIEF,
  "Promote holiday gift bundles to gift shoppers, $5000 total",
  "Test ChatGPT Ads for our sensitive skin line, $800/month",
];

export const DEMO_DASHBOARD_METRICS = {
  totalSpend30d: 1847.2,
  totalClicks30d: 624,
  avgCtr: 3.2,
  conversions30d: 18,
};

export const DEMO_CAMPAIGN_ID = "campaign_bubble_q2";

/** Legacy BrandInput for simulation compatibility */
export const DEMO_BRAND_INPUT: BrandInput = {
  name: DEMO_BRAND.name,
  url: DEMO_BRAND.url,
  category: `${DEMO_BRAND.category}, ${DEMO_BRAND.priceRange} price point`,
  productDescription: `${DEMO_BRAND.description} Brand voice: ${DEMO_BRAND.brandVoice.join(", ")}.`,
  contextHints: [
    "Gen Z buyers asking about acne treatment for sensitive skin",
    "How can I treat hyperpigmentation without harsh products",
    "Affordable skincare routine for combo skin, not luxury brands",
    "Looking to clear acne in 4-8 weeks",
    "Alternatives to expensive dermatologist-recommended skincare",
    "Best Gen Z skincare brands",
    "Starting a skincare routine in my teens",
  ],
  creatives: [
    {
      id: "ad_1",
      title: "Skincare under $20",
      description: "Gentle, derm-developed. No 12-step routines.",
      landingPage: "https://hellobubble.com/starter-kit",
    },
    {
      id: "ad_2",
      title: "Sensitive? Start here",
      description: "Every formula tested for sensitive skin first.",
      landingPage: "https://hellobubble.com/sensitive",
    },
    {
      id: "ad_3",
      title: "Anti-influencer skincare",
      description: "Real ingredients. Real prices. No markups.",
      landingPage: "https://hellobubble.com/about",
    },
  ],
};

function normalizeString(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function isDemoBrand(brand: BrandInput): boolean {
  const input = {
    ...brand,
    name: normalizeString(brand.name),
    url: normalizeString(brand.url),
    category: normalizeString(brand.category),
    productDescription: normalizeString(brand.productDescription),
    contextHints: brand.contextHints.map(normalizeString),
  };
  const demo = {
    ...DEMO_BRAND_INPUT,
    name: normalizeString(DEMO_BRAND_INPUT.name),
    url: normalizeString(DEMO_BRAND_INPUT.url),
    category: normalizeString(DEMO_BRAND_INPUT.category),
    productDescription: normalizeString(DEMO_BRAND_INPUT.productDescription),
    contextHints: DEMO_BRAND_INPUT.contextHints.map(normalizeString),
  };

  if (
    input.name !== demo.name ||
    input.url !== demo.url ||
    input.category !== demo.category
  ) {
    return false;
  }

  if (input.contextHints.length !== demo.contextHints.length) return false;
  for (let i = 0; i < demo.contextHints.length; i += 1) {
    if (input.contextHints[i] !== demo.contextHints[i]) return false;
  }

  if (input.creatives.length !== demo.creatives.length) return false;
  for (let i = 0; i < demo.creatives.length; i += 1) {
    const creative = input.creatives[i];
    const demoCreative = demo.creatives[i];
    if (
      normalizeString(creative.title) !== normalizeString(demoCreative.title) ||
      normalizeString(creative.description) !==
        normalizeString(demoCreative.description) ||
      normalizeString(creative.landingPage) !==
        normalizeString(demoCreative.landingPage)
    ) {
      return false;
    }
  }

  return true;
}

export function shouldUseDemoCache(brand: BrandInput): boolean {
  if (SKIP_DEMO_CACHE) return false;
  return isDemoBrand(brand);
}

export function shouldUsePrebakedDraft(brief: string): boolean {
  return isDefaultBrief(brief);
}

export async function loadDemoCache(
  name = "bubble-skincare-simulation",
): Promise<{ brand?: BrandInput; events: import("./types").SimulationEvent[] } | null> {
  try {
    const response = await fetch(`/demo-cache/${name}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function eventDelay(event: import("./types").SimulationEvent): number {
  switch (event.type) {
    case "conversation_generated":
      return 1500;
    case "hint_scored":
      return 250;
    case "creative_scored":
      return 400;
    case "complete":
      return 500;
    default:
      return 300;
  }
}

export async function replayDemoEvents(
  events: import("./types").SimulationEvent[],
  onEvent: (event: import("./types").SimulationEvent) => void | Promise<void>,
): Promise<void> {
  for (const event of events) {
    await onEvent(event);
    await delay(eventDelay(event));
  }
}

export async function loadPrebakedDraft(): Promise<CampaignDraft> {
  const response = await fetch("/demo-cache/bubble-skincare-campaign.json");
  if (!response.ok) throw new Error("Failed to load campaign draft");
  return response.json();
}

export function createInitialCampaign(draft: CampaignDraft): PlatformCampaign {
  return {
    id: DEMO_CAMPAIGN_ID,
    name: draft.campaign.name,
    status: "draft",
    draft,
    naturalLanguageBrief: DEFAULT_CAMPAIGN_BRIEF,
    createdAt: new Date().toISOString(),
  };
}
