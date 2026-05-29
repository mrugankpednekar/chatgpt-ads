import { fullModel, generateJsonFromPrompt } from "@/lib/openai";
import { CREATIVE_SCORING_PROMPT } from "@/lib/prompts";
import type {
  Conversation,
  CreativeScoreDetail,
  CreativeWithId,
} from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const creativeScoreSchema = z.object({
  predicted_ctr: z.number(),
  hook_strength: z.number(),
  value_clarity: z.number(),
  context_match: z.number(),
  cta_fit: z.number(),
  would_click_probability: z.number(),
  reasoning: z.string(),
});

export async function scoreCreativeDeep(
  conversation: Conversation,
  creative: CreativeWithId,
  category: string,
): Promise<CreativeScoreDetail> {
  const raw = await generateJsonFromPrompt({
    model: fullModel,
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      conversation: Conversation;
      creative: CreativeWithId;
      category: string;
    };

    if (!body.conversation || !body.creative || !body.category) {
      return NextResponse.json(
        { error: "conversation, creative, and category are required" },
        { status: 400 },
      );
    }

    const score = await scoreCreativeDeep(
      body.conversation,
      body.creative,
      body.category,
    );

    return NextResponse.json({ score });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to score creative";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
