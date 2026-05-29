import { parseJsonEventStream } from "ai";
import { z } from "zod";
import type { SimulationEvent } from "./types";

const streamChunkSchema = z.record(z.string(), z.unknown());

const SIMULATION_EVENT_TYPES = new Set([
  "conversation_generated",
  "hint_scored",
  "creative_scored",
  "complete",
  "error",
]);

function normalizeEvent(obj: Record<string, unknown>): SimulationEvent | null {
  if (typeof obj.type !== "string") return null;

  if (obj.type === "error" && "errorText" in obj && !("message" in obj)) {
    return { type: "error", message: String(obj.errorText) };
  }

  if (SIMULATION_EVENT_TYPES.has(obj.type)) {
    return obj as SimulationEvent;
  }

  return null;
}

function extractSimulationEvent(chunk: unknown): SimulationEvent | null {
  if (!chunk || typeof chunk !== "object") return null;

  const obj = chunk as Record<string, unknown>;

  if (typeof obj.type === "string" && obj.type.startsWith("data-")) {
    const data = obj.data;
    if (data && typeof data === "object" && "type" in data) {
      return normalizeEvent(data as Record<string, unknown>);
    }
    return null;
  }

  return normalizeEvent(obj);
}

export async function consumeSimulationStream(
  response: Response,
  onEvent: (event: SimulationEvent) => void,
): Promise<void> {
  if (!response.ok) {
    const message = await response.text().catch(() => "Simulation request failed");
    throw new Error(message || `Simulation failed (${response.status})`);
  }

  if (!response.body) {
    throw new Error("No response body from simulation stream");
  }

  const stream = parseJsonEventStream({
    stream: response.body,
    schema: streamChunkSchema,
  });

  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      if (value.success) {
        const event = extractSimulationEvent(value.value);
        if (event) onEvent(event);
      }
    }
  } finally {
    reader.releaseLock();
  }
}
