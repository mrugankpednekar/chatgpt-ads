export type IntentStage =
  | "discovery"
  | "research"
  | "comparison"
  | "decision"
  | "post_purchase";

export type HintRecommendation = "Use" | "Pause" | "Drop";
export type Recommendation = HintRecommendation;

export type CompetitionDensity = "low" | "medium" | "high";

export interface Persona {
  id: string;
  demographics: string;
  budgetSensitivity: string;
  intentStage: IntentStage;
  knowledgeLevel: string;
  urgency: string;
  situation: string;
  concerns: string[];
}

export interface ConversationMessage {
  role: "user";
  content: string;
  turn: number;
}

export interface Conversation {
  id: string;
  personaId?: string;
  persona_summary: string;
  intent_stage: IntentStage;
  commercial_intent_score: number;
  implied_needs?: string[];
  key_themes?: string[];
  messages: ConversationMessage[];
}

export interface Creative {
  id: string;
  title: string;
  description: string;
  landingPage: string;
  imageUrl?: string;
}

export interface BrandInput {
  name: string;
  url: string;
  category: string;
  productDescription: string;
  contextHints: string[];
  creatives: Creative[];
}

export type SimulateRequestBody = BrandInput | BrandFormInput;

export interface BrandFormInput {
  name: string;
  url: string;
  category: string;
  productDescription: string;
  contextHints: string[];
  creative: Omit<Creative, "id">[];
}

export interface HintScoreProgress {
  matchCount: number;
  matchRate: number;
  intentQuality: number;
  isComplete: boolean;
}

export interface HintScore {
  hint: string;
  conversationId: string;
  topical_relevance: number;
  intent_alignment: number;
  natural_fit: number;
  weighted_score: number;
  would_surface: boolean;
  reasoning: string;
}

export interface HintProgress {
  hint: string;
  matchCount: number;
  scoredCount: number;
  totalConversations: number;
  matchRate: number;
  avgWeightedScore: number;
  intentQuality: number;
}

export interface AggregatedHintResult {
  hint: string;
  matchCount: number;
  matchRate: number;
  avgWeightedScore: number;
  intentQuality: number;
  estimatedWeeklyImpressions: number;
  competitionDensity: CompetitionDensity;
  recommendation: HintRecommendation;
  matchedConversationIds: string[];
}

export interface CreativeScore {
  creativeId: string;
  conversationId: string;
  predicted_ctr: number;
  hook_strength: number;
  value_clarity: number;
  context_match: number;
  cta_fit: number;
  would_click_probability: number;
  reasoning: string;
}

export interface CreativeProgress {
  creativeId: string;
  title: string;
  scoredCount: number;
  totalSamples: number;
  predictedCTR: number;
}

export interface AggregatedCreativeResult {
  creativeId: string;
  title: string;
  description: string;
  landingPage: string;
  imageUrl?: string;
  predictedCTR: number;
  confidence: number;
  predictedClicksPer1000: number;
  winRate: number;
  sampleCount: number;
  scores: CreativeScore[];
}

export interface CampaignMetrics {
  predictedWeeklyImpressions: number;
  predictedCpcMin: number;
  predictedCpcMax: number;
  predictedCTR: number;
  predictedCTRConfidence: number;
  recommendedBid: number;
  estimatedWeeklySpend: number;
  impressionSparkline?: number[];
  spendSparkline?: number[];
}

export interface RankedResults {
  hints: AggregatedHintResult[];
  creatives: AggregatedCreativeResult[];
  campaign: CampaignMetrics;
  recommendations: string[];
  totalConversations: number;
}

export type SimulationEvent =
  | { type: "conversation_generated"; conversation: Conversation }
  | {
      type: "hint_scored";
      hint: string;
      progress: HintProgress;
      score?: HintScore;
    }
  | {
      type: "creative_scored";
      creativeId: string;
      title?: string;
      progress: CreativeProgress;
      score?: CreativeScore;
    }
  | { type: "complete"; results: RankedResults }
  | { type: "error"; message: string };

export interface DemoCache {
  brand?: BrandInput;
  events: SimulationEvent[];
  generatedAt?: string;
}

export interface HintResultRow {
  hint: string;
  matchCount: number;
  matchRate: number;
  intentQuality: number;
  estimatedWeeklyImpressions: number;
  competitionDensity: CompetitionDensity;
  recommendation: Recommendation;
  avgWeightedScore?: number;
}

export interface CreativeResultRow {
  creative: Omit<Creative, "id">;
  predictedCTR: number;
  predictedClicksPer1000: number;
  winRate: number;
  confidence?: number;
  isWinner?: boolean;
}

export interface UICampaignMetrics {
  predictedWeeklyImpressions: number;
  recommendedMaxCPC: number;
  recommendedCPCRange: { min: number; max: number };
  predictedCTR: number;
  ctrConfidence: number;
  estimatedWeeklySpend: number;
  impressionSparkline?: number[];
  spendSparkline?: number[];
}

export interface UIResults {
  hints: HintResultRow[];
  creatives: CreativeResultRow[];
  campaign: UICampaignMetrics;
  recommendations: string[];
}

export type HintScoreDetail = HintScore;
export type CreativeScoreDetail = CreativeScore;
export type CreativeWithId = Creative;
export type NormalizedBrandInput = BrandInput;

export type CampaignStatus =
  | "draft"
  | "simulated"
  | "pending_review"
  | "active"
  | "paused"
  | "optimized";

export type HintPattern =
  | "persona_intent"
  | "question"
  | "topic_disqualifier"
  | "outcome"
  | "stack_comparison";

export interface BrandProfile {
  id: string;
  name: string;
  url: string;
  category: string;
  priceRange: string;
  description: string;
  targetCustomer: string;
  brandVoice: string[];
  excludedTopics: string;
  logoUrl: string;
  brandColors: { primary: string; secondary: string };
  openAIAdsConnected: boolean;
  pixelInstalled: boolean;
  monthlyAdSpend: number;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  workspaceName: string;
}

export interface ContextHintDraft {
  id: string;
  text: string;
  pattern: HintPattern;
}

export interface AdDraft {
  id: string;
  title: string;
  description: string;
  landing_page: string;
  creative_angle: string;
  image_url?: string;
}

export interface AdGroupDraft {
  id: string;
  name: string;
  persona_summary: string;
  intent_stage: IntentStage;
  context_hints: ContextHintDraft[];
  ads: AdDraft[];
  max_cpc_bid_usd: number;
  budget_allocation_pct: number;
}

export interface CampaignDraftMeta {
  name: string;
  objective: "reach" | "clicks" | "conversions";
  daily_budget_usd: number;
  duration_days: number;
  rationale: string;
}

export interface CampaignDraft {
  campaign: CampaignDraftMeta;
  ad_groups: AdGroupDraft[];
}

export interface PerformanceDayRecord {
  date: string;
  ad_group_id: string;
  ad_id: string;
  predicted_impressions: number;
  actual_impressions: number;
  predicted_clicks: number;
  actual_clicks: number;
  predicted_ctr: number;
  actual_ctr: number;
  spend_usd: number;
  avg_cpc_usd: number;
  conversions: number;
  conversion_value_usd: number;
}

export interface PerformanceSummary {
  total_spend_30d: number;
  total_clicks_30d: number;
  total_impressions_30d: number;
  total_conversions_30d: number;
  avg_ctr: number;
}

export interface PerformanceData {
  campaign_id: string;
  generated_at: string;
  summary: PerformanceSummary;
  daily: PerformanceDayRecord[];
}

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  template: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  message: string;
  rationale: string;
}

export interface PlatformCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  draft: CampaignDraft;
  naturalLanguageBrief?: string;
  lastResults?: UIResults;
  openaiCampaignId?: string;
  createdAt: string;
  simulatedAt?: string;
  submittedAt?: string;
  activatedAt?: string;
}

export function draftToBrandInput(
  draft: CampaignDraft,
  brand: BrandProfile,
): BrandInput {
  const primaryGroup = draft.ad_groups[0];
  const hints = primaryGroup?.context_hints.map((h) => h.text) ?? [];
  const creatives: Creative[] = [];

  for (const group of draft.ad_groups) {
    for (const ad of group.ads) {
      creatives.push({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        landingPage: ad.landing_page,
        imageUrl: ad.image_url,
      });
    }
  }

  return {
    name: brand.name,
    url: brand.url,
    category: brand.category,
    productDescription: brand.description,
    contextHints: hints.length > 0 ? hints : [],
    creatives: creatives.slice(0, 3),
  };
}

export function isDefaultBrief(brief: string): boolean {
  const normalized = brief.trim().toLowerCase();
  return (
    normalized.includes("vitamin c serum") &&
    normalized.includes("gen z") &&
    normalized.includes("1500")
  );
}

export interface AdPersona extends Persona {
  displayName: string;
  tagline: string;
}

export interface AdAsset {
  id: string;
  name: string;
  url?: string;
  gradient?: string;
}

export interface Ad {
  id: string;
  name: string;
  persona: AdPersona;
  creatives: Creative[];
  productDocs: string;
  assets: AdAsset[];
  aiGenerated?: boolean;
}

export interface AdGroup {
  id: string;
  name: string;
  segmentLabel: string;
  contextHints: string[];
  ads: Ad[];
  hintsAiGenerated?: boolean;
}

export interface CampaignBrand {
  name: string;
  url: string;
  category: string;
  productDescription: string;
  logoInitials?: string;
}

export interface Campaign {
  id: string;
  name: string;
  brand: CampaignBrand;
  status: CampaignStatus;
  adGroups: AdGroup[];
  lastResults?: UIResults;
  createdAt: string;
  simulatedAt?: string;
  selectedAdGroupId?: string;
}

export function brandFormToBrandInput(form: BrandFormInput): BrandInput {
  return toBrandInput(form);
}

export function toUIResults(results: RankedResults): UIResults {
  return {
    hints: results.hints.map((hint) => ({
      hint: hint.hint,
      matchCount: hint.matchCount,
      matchRate: hint.matchRate,
      intentQuality: hint.intentQuality,
      estimatedWeeklyImpressions: hint.estimatedWeeklyImpressions,
      competitionDensity: hint.competitionDensity,
      recommendation: hint.recommendation,
      avgWeightedScore: hint.avgWeightedScore,
    })),
    creatives: results.creatives.map((creative, index) => ({
      creative: {
        title: creative.title,
        description: creative.description,
        landingPage: creative.landingPage,
        imageUrl: creative.imageUrl,
      },
      predictedCTR: creative.predictedCTR,
      predictedClicksPer1000: creative.predictedClicksPer1000,
      winRate: creative.winRate,
      confidence: creative.confidence,
      isWinner: index === 0,
    })),
    campaign: {
      predictedWeeklyImpressions: results.campaign.predictedWeeklyImpressions,
      recommendedMaxCPC: results.campaign.recommendedBid,
      recommendedCPCRange: {
        min: results.campaign.predictedCpcMin,
        max: results.campaign.predictedCpcMax,
      },
      predictedCTR: results.campaign.predictedCTR,
      ctrConfidence: results.campaign.predictedCTRConfidence,
      estimatedWeeklySpend: results.campaign.estimatedWeeklySpend,
      impressionSparkline: results.campaign.impressionSparkline,
      spendSparkline: results.campaign.spendSparkline,
    },
    recommendations: results.recommendations,
  };
}

export function toBrandInput(body: SimulateRequestBody): BrandInput {
  const creativeSource =
    "creatives" in body && body.creatives
      ? body.creatives
      : "creative" in body && body.creative
        ? body.creative
        : [];

  return {
    name: body.name.trim(),
    url: body.url.trim(),
    category: body.category.trim(),
    productDescription: body.productDescription.trim(),
    contextHints: body.contextHints.map((hint) => hint.trim()).filter(Boolean),
    creatives: creativeSource.map((creative, index) => ({
      id:
        "id" in creative && typeof creative.id === "string" && creative.id
          ? creative.id
          : `creative-${index + 1}`,
      title: creative.title.trim(),
      description: creative.description.trim(),
      landingPage: creative.landingPage.trim(),
      imageUrl:
        "imageUrl" in creative && typeof creative.imageUrl === "string"
          ? creative.imageUrl.trim() || undefined
          : undefined,
    })),
  };
}
