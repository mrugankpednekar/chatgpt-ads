import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SimulationEvent } from "./types";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function eventDelay(event: SimulationEvent): number {
  switch (event.type) {
    case "conversation_generated":
      return 1500;
    case "hint_scored":
      return 250;
    case "creative_scored":
      return 400;
    case "complete":
      return 500;
    default:
      return 300;
  }
}

export async function replayDemoCacheFromDisk(
  writeEvent: (event: SimulationEvent) => void | Promise<void>,
): Promise<boolean> {
  try {
    const cachePath = path.join(
      process.cwd(),
      "public",
      "demo-cache",
      "bubble-skincare-simulation.json",
    );
    const raw = await readFile(cachePath, "utf8");
    const cache = JSON.parse(raw) as { events?: SimulationEvent[] };

    if (!cache.events?.length) {
      return false;
    }

    for (const event of cache.events) {
      await writeEvent(event);
      await delay(eventDelay(event));
    }

    return true;
  } catch {
    return false;
  }
}
