import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import type { LanguageModel } from "ai";
import type { z } from "zod";

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const miniModel = openai("gpt-4o-mini");
export const fullModel = openai("gpt-4o");

export function parseJsonFromLLM<T>(text: string): T {
  let cleaned = text.trim();

  const fenced = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  if (fenced) {
    cleaned = fenced[1].trim();
  } else {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  const jsonStart = cleaned.indexOf("{");
  const arrayStart = cleaned.indexOf("[");
  const start =
    jsonStart === -1
      ? arrayStart
      : arrayStart === -1
        ? jsonStart
        : Math.min(jsonStart, arrayStart);

  if (start > 0) {
    cleaned = cleaned.slice(start);
  }

  return JSON.parse(cleaned) as T;
}

export async function generateJsonFromPrompt<T>({
  model,
  prompt,
  schema,
}: {
  model: LanguageModel;
  prompt: string;
  schema?: z.ZodType<T>;
}): Promise<T> {
  if (schema) {
    try {
      const { object } = await generateObject({
        model,
        prompt,
        schema,
      });
      return object;
    } catch {
      // Fall through to text parsing when structured output fails.
    }
  }

  const { text } = await generateText({
    model,
    prompt,
  });

  return parseJsonFromLLM<T>(text);
}
