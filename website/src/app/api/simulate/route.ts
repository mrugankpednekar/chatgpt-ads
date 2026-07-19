import { shouldUseDemoCache } from "@/lib/demo-data";
import { replayDemoCacheFromDisk } from "@/lib/demo-data-server";
import { generateJsonFromPrompt, miniModel } from "@/lib/openai";
import { generatePersonas } from "@/lib/personas";
import {
  CREATIVE_SCORING_PROMPT,
  HINT_SCORING_PROMPT,
} from "@/lib/prompts";
import {
  aggregateResults,
  enrichHintProgress,
  sampleConversationsForCreative,
} from "@/lib/scoring";
import type {
  BrandInput,
  Conversation,
  Creative,
  CreativeScore,
  HintScore,
  SimulationEvent,
  SimulateRequestBody,
} from "@/lib/types";
import { toBrandInput } from "@/lib/types";
import { generateConversation } from "@/app/api/generate-conversation/route";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { z } from "zod";

export const runtime = "nodejs";

const hintScoreSchema = z.object({
  topical_relevance: z.number(),
  intent_alignment: z.number(),
  natural_fit: z.number(),
  weighted_score: z.number(),
  would_surface: z.boolean(),
  reasoning: z.string(),
});

const creativeScoreSchema = z.object({
  predicted_ctr: z.number(),
  hook_strength: z.number(),
  value_clarity: z.number(),
  context_match: z.number(),
  cta_fit: z.number(),
  would_click_probability: z.number(),
  reasoning: z.string(),
});

type SimulationWriter = {
  writeData: (event: SimulationEvent) => void;
};

/** AI SDK v6 compatibility wrapper for the spec's createDataStreamResponse pattern. */
function createDataStreamResponse({
  execute,
  onError,
}: {
  execute: (writer: SimulationWriter) => Promise<void>;
  onError?: (error: unknown) => string;
}) {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const simulationWriter: SimulationWriter = {
        writeData: (event) => {
          writer.write({
            type: "data-simulation",
            data: event,
          });
        },
      };

      try {
        await execute(simulationWriter);
      } catch (error) {
        simulationWriter.writeData({
          type: "error",
          message: onError?.(error) ?? "Simulation failed",
        });
      }
    },
    onError,
  });

  return createUIMessageStreamResponse({ stream });
}

async function scoreHint(
  conversation: Conversation,
  hint: string,
  productDescription: string,
): Promise<HintScore> {
  const raw = await generateJsonFromPrompt({
    model: miniModel,
    prompt: HINT_SCORING_PROMPT({ conversation, hint, productDescription }),
    schema: hintScoreSchema,
  });

  const weightedScore =
    0.4 * raw.topical_relevance +
    0.4 * raw.intent_alignment +
    0.2 * raw.natural_fit;
  const wouldSurface =
    weightedScore >= 0.55 && conversation.commercial_intent_score >= 0.3;

  return {
    hint,
    conversationId: conversation.id ?? "",
    topical_relevance: raw.topical_relevance,
    intent_alignment: raw.intent_alignment,
    natural_fit: raw.natural_fit,
    weighted_score: weightedScore,
    would_surface: wouldSurface,
    reasoning: raw.reasoning,
  };
}

async function scoreCreative(
  conversation: Conversation,
  creative: Creative,
  category: string,
): Promise<CreativeScore> {
  const raw = await generateJsonFromPrompt({
    model: miniModel,
    prompt: CREATIVE_SCORING_PROMPT({ conversation, creative, category }),
    schema: creativeScoreSchema,
  });

  return {
    creativeId: creative.id,
    conversationId: conversation.id ?? "",
    predicted_ctr: raw.predicted_ctr,
    hook_strength: raw.hook_strength,
    value_clarity: raw.value_clarity,
    context_match: raw.context_match,
    cta_fit: raw.cta_fit,
    would_click_probability: raw.would_click_probability,
    reasoning: raw.reasoning,
  };
}

async function runSimulation(
  brand: BrandInput,
  writer: SimulationWriter,
): Promise<void> {
  const personas = generatePersonas(brand.category, 20);
  const conversations: Conversation[] = [];
  const hintScores: HintScore[] = [];
  const creativeScores: CreativeScore[] = [];

  for (let index = 0; index < personas.length; index += 5) {
    const batch = personas.slice(index, index + 5);
    const results = await Promise.all(
      batch.map((persona) => generateConversation(persona, brand.category)),
    );

    for (const conversation of results) {
      conversations.push(conversation);
      writer.writeData({
        type: "conversation_generated",
        conversation,
      });
    }
  }

  const hintPairs = brand.contextHints.flatMap((hint) =>
    conversations.map((conversation) => ({ hint, conversation })),
  );

  for (let index = 0; index < hintPairs.length; index += 10) {
    const batch = hintPairs.slice(index, index + 10);
    const batchScores = await Promise.all(
      batch.map(({ hint, conversation }) =>
        scoreHint(conversation, hint, brand.productDescription),
      ),
    );

    hintScores.push(...batchScores);

    for (const hint of brand.contextHints) {
      const hintBatchScores = hintScores.filter((score) => score.hint === hint);
      const progress = enrichHintProgress(
        {
          hint,
          matchCount: hintBatchScores.filter((score) => score.would_surface)
            .length,
          scoredCount: hintBatchScores.length,
          totalConversations: conversations.length,
          matchRate:
            conversations.length > 0
              ? hintBatchScores.filter((score) => score.would_surface).length /
                conversations.length
              : 0,
          avgWeightedScore: 0,
          intentQuality: 0,
        },
        hintScores,
        conversations,
      );

      writer.writeData({
        type: "hint_scored",
        hint,
        progress,
      });
    }
  }

  for (const creative of brand.creatives) {
    const sampledConversations = sampleConversationsForCreative(
      conversations,
      5,
    );
    let scoredCount = 0;

    for (const conversation of sampledConversations) {
      const score = await scoreCreative(conversation, creative, brand.category);
      creativeScores.push(score);
      scoredCount += 1;

      const creativeScoreValues = creativeScores.filter(
        (entry) => entry.creativeId === creative.id,
      );
      const predictedCTR =
        creativeScoreValues.reduce(
          (sum, entry) => sum + entry.predicted_ctr,
          0,
        ) / creativeScoreValues.length;

      writer.writeData({
        type: "creative_scored",
        creativeId: creative.id,
        title: creative.title,
        progress: {
          creativeId: creative.id,
          title: creative.title,
          scoredCount,
          totalSamples: sampledConversations.length,
          predictedCTR,
        },
        score,
      });
    }
  }

  writer.writeData({
    type: "complete",
    results: aggregateResults(
      brand,
      conversations,
      hintScores,
      creativeScores,
    ),
  });
}

export async function POST(req: Request) {
  let brand: BrandInput;

  try {
    const body = (await req.json()) as SimulateRequestBody;
    brand = toBrandInput(body);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return createDataStreamResponse({
    execute: async (writer) => {
      if (shouldUseDemoCache(brand)) {
        const replayed = await replayDemoCacheFromDisk((event) => {
          writer.writeData(event);
        });

        if (replayed) {
          return;
        }
      }

      await runSimulation(brand, writer);
    },
    onError: (error) =>
      error instanceof Error ? error.message : "Simulation failed",
  });
}
