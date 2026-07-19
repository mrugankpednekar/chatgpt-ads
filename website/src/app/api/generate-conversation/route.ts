import { generateJsonFromPrompt, miniModel } from "@/lib/openai";
import { SYNTHETIC_CONVERSATION_PROMPT } from "@/lib/prompts";
import type { Conversation, IntentStage, Persona } from "@/lib/types";
import { INTENT_STAGES } from "@/lib/personas";
import { NextResponse } from "next/server";
import { z } from "zod";

const conversationSchema = z.object({
  persona_summary: z.string(),
  intent_stage: z.enum([
    "discovery",
    "research",
    "comparison",
    "decision",
    "post_purchase",
  ]),
  commercial_intent_score: z.number(),
  implied_needs: z.array(z.string()),
  key_themes: z.array(z.string()),
  messages: z.array(
    z.object({
      role: z.literal("user"),
      content: z.string(),
      turn: z.number(),
    }),
  ),
});

export async function generateConversation(
  persona: Persona,
  category: string,
): Promise<Conversation> {
  const raw = await generateJsonFromPrompt({
    model: miniModel,
    prompt: SYNTHETIC_CONVERSATION_PROMPT({ category, persona }),
    schema: conversationSchema,
  });

  const intentStage = INTENT_STAGES.includes(raw.intent_stage as IntentStage)
    ? (raw.intent_stage as IntentStage)
    : persona.intentStage;

  return {
    id: `conversation-${persona.id}`,
    personaId: persona.id,
    persona_summary: raw.persona_summary,
    intent_stage: intentStage,
    commercial_intent_score: Math.min(
      1,
      Math.max(0, raw.commercial_intent_score),
    ),
    implied_needs: raw.implied_needs,
    key_themes: raw.key_themes,
    messages: raw.messages,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      persona: Persona;
      category: string;
    };

    if (!body.persona || !body.category) {
      return NextResponse.json(
        { error: "persona and category are required" },
        { status: 400 },
      );
    }

    const conversation = await generateConversation(body.persona, body.category);
    return NextResponse.json({ conversation });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate conversation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
