import type { CampaignDraft } from "./types";

export type LaunchStep =
  | "campaign"
  | "ad_group"
  | "creative"
  | "ads"
  | "review";

export type LaunchProgressEvent =
  | { step: LaunchStep; status: "in_progress"; name?: string }
  | {
      step: LaunchStep;
      status: "complete";
      name?: string;
      openai_id?: string;
    };

export interface LaunchResult {
  campaign_id: string;
  status: "pending_review";
  submitted_at: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateFakeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function validateCampaignDraft(draft: CampaignDraft): string[] {
  const errors: string[] = [];
  for (const ag of draft.ad_groups) {
    for (const ad of ag.ads) {
      if (ad.title.length < 16 || ad.title.length > 24) {
        errors.push(`Ad "${ad.title}" title must be 16-24 characters`);
      }
      if (ad.description.length < 32 || ad.description.length > 48) {
        errors.push(`Ad "${ad.title}" description must be 32-48 characters`);
      }
    }
  }
  return errors;
}

export async function fakeOpenAILaunch(
  draft: CampaignDraft,
  onProgress: (event: LaunchProgressEvent) => void,
): Promise<LaunchResult> {
  await sleep(800);

  const validationErrors = validateCampaignDraft(draft);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors[0]);
  }

  onProgress({ step: "campaign", status: "in_progress" });
  await sleep(1200);
  const campaignId = generateFakeId("cmpn");
  onProgress({
    step: "campaign",
    status: "complete",
    openai_id: campaignId,
  });

  for (const ag of draft.ad_groups) {
    onProgress({ step: "ad_group", name: ag.name, status: "in_progress" });
    await sleep(700);
    onProgress({
      step: "ad_group",
      name: ag.name,
      status: "complete",
      openai_id: generateFakeId("adgrp"),
    });
  }

  onProgress({ step: "creative", status: "in_progress" });
  await sleep(1500);
  onProgress({ step: "creative", status: "complete" });

  onProgress({ step: "ads", status: "in_progress" });
  await sleep(1000);
  onProgress({ step: "ads", status: "complete" });

  onProgress({ step: "review", status: "in_progress" });
  await sleep(800);
  onProgress({ step: "review", status: "complete" });

  return {
    campaign_id: campaignId,
    status: "pending_review",
    submitted_at: new Date().toISOString(),
  };
}

export async function fakeOpenAILaunchStream(
  draft: CampaignDraft,
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      const emit = (event: LaunchProgressEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      };

      try {
        const result = await fakeOpenAILaunch(draft, emit);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "complete", result })}\n\n`),
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Launch failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });
}
