import { fakeOpenAILaunchStream } from "@/lib/fake-openai-ads";
import type { CampaignDraft } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { draft: CampaignDraft };
    const stream = await fakeOpenAILaunchStream(body.draft);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Launch failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
