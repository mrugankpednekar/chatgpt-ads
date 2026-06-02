import { defaultCreativeImage } from "@/lib/creative-images";
import { DRAFT_CAMPAIGN_PROMPT } from "@/lib/prompts";
import { fullModel, generateJsonFromPrompt } from "@/lib/openai";
import type { BrandProfile, CampaignDraft } from "@/lib/types";
import { z } from "zod";

export const runtime = "nodejs";

const draftSchema = z.object({
  campaign: z.object({
    name: z.string(),
    objective: z.enum(["reach", "clicks", "conversions"]),
    daily_budget_usd: z.number(),
    duration_days: z.number(),
    rationale: z.string(),
  }),
  ad_groups: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      persona_summary: z.string(),
      intent_stage: z.enum([
        "discovery",
        "research",
        "comparison",
        "decision",
      ]),
      context_hints: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
          pattern: z.enum([
            "persona_intent",
            "question",
            "topic_disqualifier",
            "outcome",
            "stack_comparison",
          ]),
        }),
      ),
      ads: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          landing_page: z.string(),
          creative_angle: z.string(),
          image_url: z.string().optional(),
        }),
      ),
      max_cpc_bid_usd: z.number(),
      budget_allocation_pct: z.number(),
    }),
  ),
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      brand: BrandProfile;
      brief: string;
    };

    const draft = await generateJsonFromPrompt<CampaignDraft>({
      model: fullModel,
      prompt: DRAFT_CAMPAIGN_PROMPT({
        brand: body.brand,
        naturalLanguageBrief: body.brief,
      }),
      schema: draftSchema,
    });

    let adIndex = 0;
    const withImages: CampaignDraft = {
      ...draft,
      ad_groups: draft.ad_groups.map((group) => ({
        ...group,
        ads: group.ads.map((ad) => ({
          ...ad,
          image_url: ad.image_url?.trim() || defaultCreativeImage(adIndex++),
        })),
      })),
    };

    return Response.json({ draft: withImages });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to draft campaign";
    return Response.json({ error: message }, { status: 500 });
  }
}
