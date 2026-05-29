import { miniModel, generateJsonFromPrompt } from "@/lib/openai";
import { HINT_SCORING_PROMPT } from "@/lib/prompts";
import type { Conversation } from "@/lib/types";
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      conversation: Conversation;
      hint: string;
      productDescription: string;
    };

    const raw = await generateJsonFromPrompt({
      model: miniModel,
      prompt: HINT_SCORING_PROMPT({
        conversation: body.conversation,
        hint: body.hint,
        productDescription: body.productDescription,
      }),
      schema: hintScoreSchema,
    });

    const weightedScore =
      0.4 * raw.topical_relevance +
      0.4 * raw.intent_alignment +
      0.2 * raw.natural_fit;

    return Response.json({
      hint: body.hint,
      conversationId: body.conversation.id ?? "",
      topical_relevance: raw.topical_relevance,
      intent_alignment: raw.intent_alignment,
      natural_fit: raw.natural_fit,
      weighted_score: weightedScore,
      would_surface:
        weightedScore >= 0.55 &&
        body.conversation.commercial_intent_score >= 0.3,
      reasoning: raw.reasoning,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Scoring failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
