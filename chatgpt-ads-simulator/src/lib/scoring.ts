import type {
  AggregatedCreativeResult,
  AggregatedHintResult,
  BrandInput,
  CampaignMetrics,
  CompetitionDensity,
  Conversation,
  Creative,
  CreativeScoreDetail,
  HintScoreDetail,
  HintProgress,
  RankedResults,
  Recommendation,
} from "./types";

const WEEKLY_ADDRESSABLE_IMPRESSIONS = 50_000;
const BASE_CPC_MIN = 3;
const BASE_CPC_MAX = 5;

function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdev(values: number[]): number {
  if (values.length <= 1) {
    return 0;
  }
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
}

function estimateCompetitionDensity(hint: string): CompetitionDensity {
  const words = hint.trim().split(/\s+/).length;
  const genericTerms = [
    "best",
    "top",
    "skincare",
    "routine",
    "products",
    "brands",
    "affordable",
  ];
  const genericHits = genericTerms.filter((term) =>
    hint.toLowerCase().includes(term),
  ).length;

  if (words <= 4 || genericHits >= 3) {
    return "high";
  }
  if (words <= 7 || genericHits >= 1) {
    return "medium";
  }
  return "low";
}

function competitionScore(density: CompetitionDensity): number {
  switch (density) {
    case "low":
      return 0.25;
    case "medium":
      return 0.55;
    case "high":
      return 0.85;
  }
}

function recommendationForMatchRate(matchRate: number): Recommendation {
  if (matchRate < 0.1) {
    return "Drop";
  }
  if (matchRate < 0.3) {
    return "Pause";
  }
  return "Use";
}

export function enrichHintProgress(
  progress: HintProgress,
  scores: HintScoreDetail[],
  conversations: Conversation[],
): HintProgress {
  const matchedScores = scores.filter(
    (score) => score.hint === progress.hint && score.would_surface,
  );
  const conversationById = new Map(
    conversations.map((conversation) => [conversation.id, conversation]),
  );

  return {
    ...progress,
    avgWeightedScore: mean(matchedScores.map((score) => score.weighted_score)),
    intentQuality: mean(
      matchedScores.map(
        (score) =>
          conversationById.get(score.conversationId)?.commercial_intent_score ??
          0,
      ),
    ),
  };
}

export function aggregateHintResults(
  hints: string[],
  scores: HintScoreDetail[],
  conversations: Conversation[],
): AggregatedHintResult[] {
  const totalConversations = conversations.length;
  const conversationById = new Map(
    conversations.map((conversation) => [conversation.id, conversation]),
  );

  return hints.map((hint) => {
    const hintScores = scores.filter((score) => score.hint === hint);
    const matchedScores = hintScores.filter((score) => score.would_surface);
    const matchCount = matchedScores.length;
    const matchRate =
      totalConversations > 0 ? matchCount / totalConversations : 0;

    return {
      hint,
      matchCount,
      matchRate,
      avgWeightedScore: mean(matchedScores.map((score) => score.weighted_score)),
      intentQuality: mean(
        matchedScores.map(
          (score) =>
            conversationById.get(score.conversationId)?.commercial_intent_score ??
            0,
        ),
      ),
      estimatedWeeklyImpressions: Math.round(
        matchRate * WEEKLY_ADDRESSABLE_IMPRESSIONS,
      ),
      competitionDensity: estimateCompetitionDensity(hint),
      recommendation: recommendationForMatchRate(matchRate),
      matchedConversationIds: matchedScores.map((score) => score.conversationId),
    };
  });
}

export function aggregateCreativeResults(
  creatives: Creative[],
  scores: CreativeScoreDetail[],
): AggregatedCreativeResult[] {
  const results = creatives.map((creative) => {
    const creativeScores = scores.filter(
      (score) => score.creativeId === creative.id,
    );
    const ctrValues = creativeScores.map((score) => score.predicted_ctr);
    const predictedCTR = mean(ctrValues);
    const ctrStdev = stdev(ctrValues);

    return {
      creativeId: creative.id,
      title: creative.title,
      description: creative.description,
      landingPage: creative.landingPage,
      imageUrl: creative.imageUrl,
      predictedCTR: Number(predictedCTR.toFixed(2)),
      confidence:
        predictedCTR > 0
          ? Number(Math.max(0, 1 - ctrStdev / predictedCTR).toFixed(2))
          : 0,
      predictedClicksPer1000: Number((predictedCTR * 10).toFixed(1)),
      winRate: 0,
      sampleCount: creativeScores.length,
      scores: creativeScores,
    };
  });

  if (results.length === 0) {
    return results;
  }

  const maxCtr = Math.max(...results.map((result) => result.predictedCTR), 0.01);

  return results
    .map((result) => ({
      ...result,
      winRate: Number((result.predictedCTR / maxCtr).toFixed(2)),
    }))
    .sort((a, b) => b.predictedCTR - a.predictedCTR);
}

export function aggregateCampaignMetrics(
  hintResults: AggregatedHintResult[],
  creativeResults: AggregatedCreativeResult[],
): CampaignMetrics {
  const activeHints = hintResults.filter(
    (hint) => hint.recommendation !== "Drop",
  );
  const avgIntentQuality = mean(activeHints.map((hint) => hint.intentQuality));
  const avgCompetition = mean(
    activeHints.map((hint) => competitionScore(hint.competitionDensity)),
  );
  const relevanceMultiplier = 0.75 + avgIntentQuality * 0.5;
  const predictedWeeklyImpressions = activeHints.reduce(
    (sum, hint) => sum + hint.estimatedWeeklyImpressions,
    0,
  );
  const predictedCTR = mean(creativeResults.map((creative) => creative.predictedCTR));
  const predictedCTRConfidence = mean(
    creativeResults.map((creative) => creative.confidence),
  );
  const recommendedBid = Number(
    (2.5 + avgIntentQuality * 2.5 + avgCompetition * 1.5).toFixed(2),
  );
  const estimatedWeeklySpend = Number(
    ((predictedWeeklyImpressions / 1000) * recommendedBid).toFixed(2),
  );

  const impressionSparkline = activeHints
    .slice(0, 7)
    .map((hint) => hint.estimatedWeeklyImpressions);

  return {
    predictedWeeklyImpressions: Math.round(predictedWeeklyImpressions),
    predictedCpcMin: Number((BASE_CPC_MIN * relevanceMultiplier).toFixed(2)),
    predictedCpcMax: Number((BASE_CPC_MAX * relevanceMultiplier).toFixed(2)),
    predictedCTR: Number(predictedCTR.toFixed(2)),
    predictedCTRConfidence: Number(predictedCTRConfidence.toFixed(2)),
    recommendedBid,
    estimatedWeeklySpend,
    impressionSparkline,
    spendSparkline: impressionSparkline.map((value) =>
      Number(((value / 1000) * recommendedBid).toFixed(0)),
    ),
  };
}

export function buildRecommendations(
  hintResults: AggregatedHintResult[],
  creativeResults: AggregatedCreativeResult[],
): string[] {
  const recommendations: string[] = [];

  for (const hint of hintResults) {
    if (hint.recommendation === "Drop") {
      recommendations.push(
        `Drop hint "${hint.hint}" (${Math.round(hint.matchRate * 100)}% match rate).`,
      );
    } else if (hint.recommendation === "Use" && hint.matchRate >= 0.3) {
      recommendations.push(
        `Boost hint "${hint.hint}" (${Math.round(hint.matchRate * 100)}% match, high intent).`,
      );
    }
  }

  if (creativeResults.length >= 2) {
    const [winner, runnerUp] = creativeResults;
    if (winner.predictedCTR > 0 && runnerUp.predictedCTR > 0) {
      const multiplier = (winner.predictedCTR / runnerUp.predictedCTR).toFixed(1);
      recommendations.push(
        `Lead with creative "${winner.title}" (predicted ${multiplier}x CTR over "${runnerUp.title}").`,
      );
    }
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Run another simulation with refined context hints to improve match rates.",
    );
  }

  return recommendations;
}

export function aggregateResults(
  brand: BrandInput,
  conversations: Conversation[],
  hintScores: HintScoreDetail[],
  creativeScores: CreativeScoreDetail[],
): RankedResults {
  const hints = aggregateHintResults(
    brand.contextHints,
    hintScores,
    conversations,
  ).sort((a, b) => b.matchRate - a.matchRate);
  const creatives = aggregateCreativeResults(brand.creatives, creativeScores);
  const campaign = aggregateCampaignMetrics(hints, creatives);
  const recommendations = buildRecommendations(hints, creatives);

  return {
    hints,
    creatives,
    campaign,
    recommendations,
    totalConversations: conversations.length,
  };
}

export function sampleConversationsForCreative(
  conversations: Conversation[],
  sampleSize = 5,
): Conversation[] {
  if (conversations.length <= sampleSize) {
    return conversations;
  }

  const step = conversations.length / sampleSize;
  return Array.from({ length: sampleSize }, (_, index) => {
    const picked = conversations[Math.floor(index * step)];
    return picked ?? conversations[index];
  });
}
