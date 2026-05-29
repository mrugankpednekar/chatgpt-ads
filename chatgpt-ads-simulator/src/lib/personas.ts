import type { IntentStage, Persona } from "./types";

const INTENT_STAGES: IntentStage[] = [
  "discovery",
  "research",
  "comparison",
  "decision",
  "post_purchase",
];

const AGE_BUCKETS = [
  { label: "18-24", weight: 0.2 },
  { label: "25-34", weight: 0.35 },
  { label: "35-44", weight: 0.25 },
  { label: "45-54", weight: 0.15 },
  { label: "55+", weight: 0.05 },
] as const;

const BUDGETS = [
  { value: "tight" as const, weight: 0.3 },
  { value: "moderate" as const, weight: 0.5 },
  { value: "flexible" as const, weight: 0.2 },
];

const KNOWLEDGE = [
  { value: "novice" as const, weight: 0.4 },
  { value: "intermediate" as const, weight: 0.4 },
  { value: "expert" as const, weight: 0.2 },
];

const INTENT_DISTRIBUTION: { stage: IntentStage; weight: number }[] = [
  { stage: "discovery", weight: 0.2 },
  { stage: "research", weight: 0.15 },
  { stage: "comparison", weight: 0.3 },
  { stage: "decision", weight: 0.25 },
  { stage: "post_purchase", weight: 0.1 },
];

const SKINCARE_TEMPLATES: Omit<Persona, "id">[] = [
  {
    demographics: "16-year-old high school student, suburban US",
    budgetSensitivity: "tight",
    intentStage: "discovery",
    knowledgeLevel: "novice",
    urgency: "low — curious after seeing TikTok routines",
    situation: "Just starting skincare with mom's credit card and a $30 monthly budget",
    concerns: ["acne breakouts", "overwhelmed by product options", "sensitive skin"],
  },
  {
    demographics: "19-year-old college freshman, dorm living",
    budgetSensitivity: "tight",
    intentStage: "research",
    knowledgeLevel: "novice",
    urgency: "medium — breakouts before spring formal",
    situation: "Sharing a tiny bathroom and wants a simple 3-step routine under $25",
    concerns: ["dry patches from dorm heat", "fragrance sensitivity", "time constraints"],
  },
  {
    demographics: "22-year-old recent grad, first apartment",
    budgetSensitivity: "moderate",
    intentStage: "comparison",
    knowledgeLevel: "intermediate",
    urgency: "medium — wants to upgrade from drugstore staples",
    situation: "Comparing derm-recommended brands after years of CeraVe-only routine",
    concerns: ["combo skin", "dark spots from old acne", "value for money"],
  },
  {
    demographics: "28-year-old marketing associate, urban",
    budgetSensitivity: "tight",
    intentStage: "comparison",
    knowledgeLevel: "intermediate",
    urgency: "high — switching brands after layoff",
    situation: "Adult acne and combo skin, moving off luxury products she can no longer afford",
    concerns: ["adult acne", "combo skin", "budget after income drop"],
  },
  {
    demographics: "31-year-old software engineer, remote worker",
    budgetSensitivity: "moderate",
    intentStage: "decision",
    knowledgeLevel: "expert",
    urgency: "low — optimizing existing routine",
    situation: "Reads ingredient lists and wants science-backed products without influencer hype",
    concerns: ["niacinamide compatibility", "minimal packaging waste", "non-comedogenic formulas"],
  },
  {
    demographics: "34-year-old new parent, sleep-deprived",
    budgetSensitivity: "moderate",
    intentStage: "decision",
    knowledgeLevel: "novice",
    urgency: "high — no time for 12-step routines",
    situation: "Wants effective minimalism: cleanse, moisturize, SPF in under 5 minutes",
    concerns: ["hormonal skin changes", "zero time", "safe while breastfeeding"],
  },
  {
    demographics: "38-year-old teacher, active lifestyle",
    budgetSensitivity: "moderate",
    intentStage: "research",
    knowledgeLevel: "intermediate",
    urgency: "medium — seasonal dryness",
    situation: "Winter dryness and redness after outdoor runs, looking for gentle hydration",
    concerns: ["redness", "dryness", "sweat-triggered breakouts"],
  },
  {
    demographics: "42-year-old small business owner",
    budgetSensitivity: "flexible",
    intentStage: "comparison",
    knowledgeLevel: "intermediate",
    urgency: "medium — preparing for client-facing events",
    situation: "Wants polished skin without looking overdone, comparing mid-range DTC brands",
    concerns: ["fine lines", "uneven tone", "products that work under makeup"],
  },
  {
    demographics: "47-year-old perimenopause, suburban",
    budgetSensitivity: "flexible",
    intentStage: "decision",
    knowledgeLevel: "intermediate",
    urgency: "high — sudden sensitivity flare-ups",
    situation: "Sensitive skin with new hormonal changes, willing to spend on proven gentle formulas",
    concerns: ["sensitivity", "anti-aging", "hormonal breakouts"],
  },
  {
    demographics: "52-year-old empty nester",
    budgetSensitivity: "flexible",
    intentStage: "research",
    knowledgeLevel: "novice",
    urgency: "low — exploring skincare for the first time seriously",
    situation: "Dermatologist suggested starting a basic routine after years of soap-and-water",
    concerns: ["dryness", "sun damage", "confusing product labels"],
  },
  {
    demographics: "24-year-old fitness instructor",
    budgetSensitivity: "moderate",
    intentStage: "discovery",
    knowledgeLevel: "novice",
    urgency: "medium — constant sweat and clogged pores",
    situation: "Needs lightweight products that survive multiple daily showers",
    concerns: ["body acne", " clogged pores", "quick absorption"],
  },
  {
    demographics: "26-year-old beauty enthusiast",
    budgetSensitivity: "flexible",
    intentStage: "comparison",
    knowledgeLevel: "expert",
    urgency: "low — hunting for underrated brands",
    situation: "Already knows ingredient science, comparing indie DTC against legacy brands",
    concerns: ["transparency", "clinical backing", "dupes vs premium"],
  },
  {
    demographics: "29-year-old nurse, night shifts",
    budgetSensitivity: "moderate",
    intentStage: "decision",
    knowledgeLevel: "intermediate",
    urgency: "high — dull tired skin from shift work",
    situation: "Needs brightening and hydration that survives mask wear and long shifts",
    concerns: ["dullness", "dehydration", "maskne"],
  },
  {
    demographics: "33-year-old wedding planner",
    budgetSensitivity: "moderate",
    intentStage: "research",
    knowledgeLevel: "intermediate",
    urgency: "medium — trial period before busy season",
    situation: "Testing gentle products before recommending them to bridal clients",
    concerns: ["photogenic glow", "no fragrance", "quick results"],
  },
  {
    demographics: "36-year-old stay-at-home parent",
    budgetSensitivity: "tight",
    intentStage: "discovery",
    knowledgeLevel: "novice",
    urgency: "low — self-care after kids' bedtime",
    situation: "Heard about Gen Z skincare trends from teenage daughter, curious but skeptical",
    concerns: ["affordability", "simplicity", "anti-aging on a budget"],
  },
  {
    demographics: "40-year-old consultant, frequent traveler",
    budgetSensitivity: "flexible",
    intentStage: "decision",
    knowledgeLevel: "expert",
    urgency: "medium — TSA-friendly routine",
    situation: "Needs travel-size friendly products that handle dry airplane cabin skin",
    concerns: ["travel sizes", "barrier repair", "consistent results across climates"],
  },
  {
    demographics: "45-year-old office manager",
    budgetSensitivity: "moderate",
    intentStage: "post_purchase",
    knowledgeLevel: "intermediate",
    urgency: "low — evaluating recent purchase",
    situation: "Bought a starter kit last month and wondering if she should repurchase or switch",
    concerns: ["product layering", "repurchase value", "mild irritation"],
  },
  {
    demographics: "21-year-old barista, gig worker",
    budgetSensitivity: "tight",
    intentStage: "research",
    knowledgeLevel: "novice",
    urgency: "medium — visible breakouts at work",
    situation: "Wants affordable acne care that won't sting on tight budget",
    concerns: ["acne", "oily T-zone", "price per ounce"],
  },
  {
    demographics: "27-year-old content creator",
    budgetSensitivity: "moderate",
    intentStage: "comparison",
    knowledgeLevel: "expert",
    urgency: "low — authentic brand alignment for audience",
    situation: "Looking for anti-influencer brands with real ingredient stories to feature",
    concerns: ["brand ethics", "before/after realism", "audience trust"],
  },
  {
    demographics: "55-year-old retiree",
    budgetSensitivity: "moderate",
    intentStage: "post_purchase",
    knowledgeLevel: "novice",
    urgency: "low — unrelated product question",
    situation: "Already happy with current routine, asking ChatGPT about gift ideas for granddaughter",
    concerns: ["gift suitability", "teen-friendly products", "allergies"],
  },
];

const GENERIC_TEMPLATES: Omit<Persona, "id">[] = [
  {
    demographics: "25-year-old early adopter",
    budgetSensitivity: "moderate",
    intentStage: "discovery",
    knowledgeLevel: "novice",
    urgency: "low — exploring category basics",
    situation: "New to the category and trying to understand where to start",
    concerns: ["overwhelmed by options", "trustworthy recommendations", "budget fit"],
  },
  {
    demographics: "32-year-old professional",
    budgetSensitivity: "moderate",
    intentStage: "comparison",
    knowledgeLevel: "intermediate",
    urgency: "medium — evaluating top options",
    situation: "Shortlisting brands before making a purchase decision",
    concerns: ["value for money", "quality signals", "peer reviews"],
  },
  {
    demographics: "41-year-old decision-ready buyer",
    budgetSensitivity: "flexible",
    intentStage: "decision",
    knowledgeLevel: "expert",
    urgency: "high — ready to buy this week",
    situation: "Has narrowed to two options and wants final validation",
    concerns: ["ROI", "long-term fit", "switching costs"],
  },
];

function weightedPick<T>(items: { value: T; weight: number }[], index: number): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = (index * 0.618033988749895) % 1;
  cursor *= total;

  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.value;
    }
  }

  return items[items.length - 1].value;
}

function pickIntentStage(index: number, count: number): IntentStage {
  const slots = INTENT_DISTRIBUTION.flatMap(({ stage, weight }) =>
    Array.from({ length: Math.round(weight * count) }, () => stage),
  );

  while (slots.length < count) {
    slots.push("research");
  }

  return slots[index % slots.length] ?? "research";
}

function isSkincareCategory(category: string): boolean {
  const normalized = category.toLowerCase();
  return (
    normalized.includes("skincare") ||
    normalized.includes("skin care") ||
    normalized.includes("beauty") ||
    normalized.includes("cosmetic")
  );
}

function buildDemographics(template: Omit<Persona, "id">, index: number): string {
  const ageBucket = AGE_BUCKETS[index % AGE_BUCKETS.length]?.label ?? "25-34";
  if (template.demographics.includes("year-old")) {
    return template.demographics;
  }
  return `${ageBucket} ${template.demographics}`;
}

export function generatePersonas(category: string, count = 20): Persona[] {
  const templates = isSkincareCategory(category)
    ? SKINCARE_TEMPLATES
    : [...SKINCARE_TEMPLATES.slice(0, 8), ...GENERIC_TEMPLATES];

  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length];
    const intentStage = pickIntentStage(index, count);
    const budgetSensitivity = weightedPick(BUDGETS, index);
    const knowledgeLevel = weightedPick(KNOWLEDGE, index + 3);

    return {
      id: `persona-${index + 1}`,
      demographics: buildDemographics(template, index),
      budgetSensitivity,
      intentStage,
      knowledgeLevel,
      urgency: template.urgency,
      situation: template.situation.replace(/\bcategory\b/gi, category),
      concerns: [...template.concerns],
    };
  });
}

export { INTENT_STAGES };
