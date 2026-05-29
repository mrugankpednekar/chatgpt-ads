import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const DEMO_BRAND = {
  name: "Bubble Skincare",
  url: "https://hellobubble.com",
  category: "DTC skincare, Gen Z target, $10-30 price point",
  productDescription:
    "Affordable, dermatologist-developed skincare for Gen Z and young millennials. Hero products: gentle cleansers, hydrating moisturizers, and lightweight serums. Brand voice: friendly, science-backed but accessible, anti-influencer.",
  contextHints: [
    "affordable skincare routine for teenagers and 20s",
    "gentle skincare for acne-prone skin",
    "dermatologist-recommended skincare under $30",
    "alternatives to expensive luxury skincare",
    "skincare for combination skin beginners",
    "non-irritating moisturizer for dry skin",
    "best Gen Z skincare brands",
  ],
  creatives: [
    {
      id: "creative-1",
      title: "Skincare that actually fits your budget",
      description:
        "Bubble's gentle, derm-developed formulas start at $10. No 12-step routines, no marketing fluff — just skincare that works.",
      landingPage: "Shop bestsellers under $20",
    },
    {
      id: "creative-2",
      title: "Sensitive skin? You're in the right place.",
      description:
        "Every Bubble formula is tested for sensitive skin first. Real ingredients, real results, no irritation.",
      landingPage: "Sensitive skin starter kit",
    },
    {
      id: "creative-3",
      title: "Bubble — the anti-influencer skincare brand",
      description:
        "Real ingredients. Real prices. No celebrity markups. Loved by dermatologists and 14-year-olds alike.",
      landingPage: "Why Bubble is different",
    },
  ],
};

const PERSONA_SUMMARIES = [
  "16-year-old starting skincare on a $30 budget from mom",
  "28-year-old with adult acne switching from luxury after layoff",
  "34-year-old new parent wanting minimal effective routine",
  "22-year-old college student with combination skin",
  "19-year-old with sensitive acne-prone skin",
  "31-year-old comparing drugstore vs premium options",
  "26-year-old influencer skeptic looking for honest brands",
  "45-year-old perimenopause with sensitive aging skin",
  "17-year-old athlete dealing with sweat breakouts",
  "24-year-old with dry skin in cold climate",
  "29-year-old rebuilding routine after dermatologist visit",
  "21-year-old on tight budget, first real job",
  "38-year-old with rosacea seeking gentle products",
  "18-year-old prom prep, wants clear skin fast",
  "33-year-old tired of 12-step routines",
  "27-year-old comparing Gen Z brand options",
  "20-year-old with hormonal acne from birth control",
  "42-year-old buying skincare for teenage daughter",
  "23-year-old minimalist wanting 3-product routine",
  "30-year-old switching from CeraVe alternatives",
];

const USER_MESSAGES = [
  ["whats a good starter skincare routine for teens on a budget?", "i dont want anything harsh, just cleanser and moisturizer maybe", "anything under $15 per product?"],
  ["adult acne at 28 is killing me", "switched from la mer bc of layoff lol", "need something gentle but actually works for combo skin"],
  ["new mom here zero time for skincare", "whats the absolute minimum i need", "prefer derm recommended stuff"],
  ["combo skin is so confusing", "oily t zone dry cheeks", "what brands are good for beginners"],
  ["my skin gets red from everything", "need products for sensitive acne prone skin", "no fragrance please"],
  ["is expensive skincare actually worth it", "looking for luxury alternatives", "under $30 per product"],
  ["tired of influencer skincare hype", "want science backed brands", "affordable options?"],
  ["perimenopause skin is so sensitive now", "anti aging but gentle", "derm recommended under $30"],
  ["sweat breakouts from sports", "need something for teen athlete skin", "simple routine"],
  ["winter dry skin help", "moisturizer that wont irritate", "affordable options"],
  ["derm said simplify my routine", "what should i actually buy", "gentle cleanser recs"],
  ["first paycheck want to upgrade skincare", "but still cheap", "gen z friendly brands?"],
  ["rosacea friendly products", "non irritating moisturizer", "budget friendly"],
  ["prom in 6 weeks need clear skin", "gentle acne routine", "nothing too harsh"],
  ["over 12 step routines", "minimal effective skincare", "3 products max"],
  ["best gen z skincare brands 2024", "not influencer junk", "actually affordable"],
  ["hormonal acne from new pill", "gentle treatment options", "under $25"],
  ["skincare for my 15yo daughter", "gentle and affordable", "derm approved?"],
  ["3 product routine recs", "cleanser moisturizer sunscreen", "budget friendly"],
  ["alternatives to cerave", "similar price point", "maybe something gen z likes"],
];

const INTENT_STAGES = ["discovery", "research", "comparison", "decision", "post_purchase"];
const COMMERCIAL_SCORES = [0.25, 0.35, 0.45, 0.55, 0.65, 0.72, 0.78, 0.82, 0.88, 0.92, 0.38, 0.42, 0.58, 0.68, 0.75, 0.48, 0.52, 0.62, 0.71, 0.85];

const HINT_MATCH_RULES = {
  "affordable skincare routine for teenagers and 20s": { rate: 0.45, keywords: ["teen", "budget", "affordable", "gen z", "starter"] },
  "gentle skincare for acne-prone skin": { rate: 0.55, keywords: ["acne", "gentle", "sensitive", "breakout"] },
  "dermatologist-recommended skincare under $30": { rate: 0.35, keywords: ["derm", "recommended", "$30", "under"] },
  "alternatives to expensive luxury skincare": { rate: 0.30, keywords: ["luxury", "expensive", "alternative", "la mer", "worth"] },
  "skincare for combination skin beginners": { rate: 0.40, keywords: ["combo", "combination", "beginner", "oily"] },
  "non-irritating moisturizer for dry skin": { rate: 0.25, keywords: ["dry", "moisturizer", "irritating", "winter"] },
  "best Gen Z skincare brands": { rate: 0.50, keywords: ["gen z", "brand", "influencer"] },
};

function buildConversations() {
  return PERSONA_SUMMARIES.map((summary, i) => ({
    id: `conv-${i + 1}`,
    personaId: `persona-${i + 1}`,
    persona_summary: summary,
    intent_stage: INTENT_STAGES[i % INTENT_STAGES.length],
    commercial_intent_score: COMMERCIAL_SCORES[i],
    implied_needs: ["affordable", "gentle", "effective"],
    key_themes: ["budget", "sensitive skin", "simplicity"],
    messages: USER_MESSAGES[i].map((content, turn) => ({
      role: "user",
      content,
      turn: turn + 1,
    })),
  }));
}

function scoreHint(conversation, hint, hintIndex) {
  const rule = HINT_MATCH_RULES[hint];
  const text = conversation.messages.map((m) => m.content).join(" ").toLowerCase();
  const keywordHits = rule.keywords.filter((k) => text.includes(k)).length;
  const baseRelevance = 0.3 + keywordHits * 0.15 + (hintIndex % 3) * 0.05;
  const topical = Math.min(0.95, baseRelevance + Math.random() * 0.1);
  const intent = Math.min(0.95, conversation.commercial_intent_score + 0.1);
  const natural = Math.min(0.9, topical * 0.9);
  const weighted = 0.4 * topical + 0.4 * intent + 0.2 * natural;
  const wouldSurface = weighted >= 0.55 && conversation.commercial_intent_score >= 0.3 && Math.random() < rule.rate + 0.2;

  return {
    hint,
    conversationId: conversation.id,
    topical_relevance: Number(topical.toFixed(2)),
    intent_alignment: Number(intent.toFixed(2)),
    natural_fit: Number(natural.toFixed(2)),
    weighted_score: Number(weighted.toFixed(2)),
    would_surface: wouldSurface,
    reasoning: wouldSurface ? "Strong topical and intent alignment for this conversation." : "Low natural fit for this conversation context.",
  };
}

function scoreCreative(conversation, creative, creativeIndex) {
  const ctrBase = [4.2, 5.8, 3.1][creativeIndex];
  const intentBoost = conversation.commercial_intent_score * 3;
  const predicted_ctr = Number((ctrBase + intentBoost + Math.random()).toFixed(1));

  return {
    creativeId: creative.id,
    conversationId: conversation.id,
    predicted_ctr,
    hook_strength: Number((0.6 + Math.random() * 0.3).toFixed(2)),
    value_clarity: Number((0.65 + Math.random() * 0.25).toFixed(2)),
    context_match: Number((0.55 + Math.random() * 0.35).toFixed(2)),
    cta_fit: Number((0.5 + Math.random() * 0.4).toFixed(2)),
    would_click_probability: Number((predicted_ctr / 15).toFixed(2)),
    reasoning: "Predicted CTR based on intent stage and creative-message alignment.",
  };
}

function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function aggregateHintResults(hints, scores, conversations) {
  return hints.map((hint) => {
    const hintScores = scores.filter((s) => s.hint === hint);
    const matched = hintScores.filter((s) => s.would_surface);
    const matchRate = matched.length / conversations.length;
    const convById = Object.fromEntries(conversations.map((c) => [c.id, c]));

    return {
      hint,
      matchCount: matched.length,
      matchRate: Number(matchRate.toFixed(3)),
      avgWeightedScore: Number(mean(matched.map((s) => s.weighted_score)).toFixed(2)),
      intentQuality: Number(mean(matched.map((s) => convById[s.conversationId]?.commercial_intent_score ?? 0)).toFixed(2)),
      estimatedWeeklyImpressions: Math.round(matchRate * 50000),
      competitionDensity: hint.split(" ").length <= 5 ? "high" : hint.split(" ").length <= 7 ? "medium" : "low",
      recommendation: matchRate < 0.1 ? "Drop" : matchRate < 0.3 ? "Pause" : "Use",
      matchedConversationIds: matched.map((s) => s.conversationId),
    };
  }).sort((a, b) => b.matchRate - a.matchRate);
}

function aggregateCreativeResults(creatives, scores) {
  const results = creatives.map((creative) => {
    const cs = scores.filter((s) => s.creativeId === creative.id);
    const ctr = mean(cs.map((s) => s.predicted_ctr));
    return {
      creativeId: creative.id,
      title: creative.title,
      description: creative.description,
      landingPage: creative.landingPage,
      predictedCTR: Number(ctr.toFixed(2)),
      confidence: 0.82,
      predictedClicksPer1000: Number((ctr * 10).toFixed(1)),
      winRate: 0,
      sampleCount: cs.length,
      scores: cs,
    };
  });
  const maxCtr = Math.max(...results.map((r) => r.predictedCTR));
  return results.map((r) => ({ ...r, winRate: Number((r.predictedCTR / maxCtr).toFixed(2)) })).sort((a, b) => b.predictedCTR - a.predictedCTR);
}

function buildEvents() {
  const conversations = buildConversations();
  const events = [];

  for (const conversation of conversations) {
    events.push({ type: "conversation_generated", conversation });
  }

  const hintScores = [];
  for (const hint of DEMO_BRAND.contextHints) {
    const hintIndex = DEMO_BRAND.contextHints.indexOf(hint);
    for (const conversation of conversations) {
      hintScores.push(scoreHint(conversation, hint, hintIndex));
    }

    const hintBatch = hintScores.filter((s) => s.hint === hint);
    const matched = hintBatch.filter((s) => s.would_surface);
    const convById = Object.fromEntries(conversations.map((c) => [c.id, c]));

    events.push({
      type: "hint_scored",
      hint,
      progress: {
        hint,
        matchCount: matched.length,
        scoredCount: hintBatch.length,
        totalConversations: conversations.length,
        matchRate: Number((matched.length / conversations.length).toFixed(3)),
        avgWeightedScore: Number(mean(matched.map((s) => s.weighted_score)).toFixed(2)),
        intentQuality: Number(mean(matched.map((s) => convById[s.conversationId]?.commercial_intent_score ?? 0)).toFixed(2)),
      },
    });
  }

  const creativeScores = [];
  for (const creative of DEMO_BRAND.creatives) {
    const sampled = conversations.filter((_, i) => i % 4 === 0).slice(0, 5);
    let scoredCount = 0;
    for (const conversation of sampled) {
      const score = scoreCreative(conversation, creative, DEMO_BRAND.creatives.indexOf(creative));
      creativeScores.push(score);
      scoredCount++;
      const cs = creativeScores.filter((s) => s.creativeId === creative.id);
      events.push({
        type: "creative_scored",
        creativeId: creative.id,
        title: creative.title,
        progress: {
          creativeId: creative.id,
          title: creative.title,
          scoredCount,
          totalSamples: sampled.length,
          predictedCTR: Number(mean(cs.map((s) => s.predicted_ctr)).toFixed(2)),
        },
        score,
      });
    }
  }

  const hints = aggregateHintResults(DEMO_BRAND.contextHints, hintScores, conversations);
  const creatives = aggregateCreativeResults(DEMO_BRAND.creatives, creativeScores);
  const activeHints = hints.filter((h) => h.recommendation !== "Drop");
  const predictedWeeklyImpressions = activeHints.reduce((s, h) => s + h.estimatedWeeklyImpressions, 0);
  const predictedCTR = mean(creatives.map((c) => c.predictedCTR));
  const recommendedBid = 4.25;

  events.push({
    type: "complete",
    results: {
      hints,
      creatives,
      campaign: {
        predictedWeeklyImpressions,
        predictedCpcMin: 3.45,
        predictedCpcMax: 5.75,
        predictedCTR: Number(predictedCTR.toFixed(2)),
        predictedCTRConfidence: 0.82,
        recommendedBid,
        estimatedWeeklySpend: Number(((predictedWeeklyImpressions / 1000) * recommendedBid).toFixed(2)),
        impressionSparkline: activeHints.slice(0, 7).map((h) => h.estimatedWeeklyImpressions),
        spendSparkline: activeHints.slice(0, 7).map((h) => Math.round((h.estimatedWeeklyImpressions / 1000) * recommendedBid)),
      },
      recommendations: [
        'Boost hint "gentle skincare for acne-prone skin" (55% match, high intent).',
        'Boost hint "best Gen Z skincare brands" (50% match, high intent).',
        `Lead with creative "${creatives[0].title}" (predicted ${(creatives[0].predictedCTR / creatives[1].predictedCTR).toFixed(1)}x CTR over "${creatives[1].title}").`,
        'Drop hint "non-irritating moisturizer for dry skin" (25% match rate).',
      ],
      totalConversations: conversations.length,
    },
  });

  return events;
}

const events = buildEvents();
const cache = {
  brand: DEMO_BRAND,
  generatedAt: new Date().toISOString(),
  events,
};

const outPath = path.join(root, "public", "demo-cache.json");
await writeFile(outPath, JSON.stringify(cache, null, 2));
console.log(`Wrote ${events.length} events to ${outPath}`);
