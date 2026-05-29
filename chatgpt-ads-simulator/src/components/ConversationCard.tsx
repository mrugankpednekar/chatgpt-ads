"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Conversation } from "@/lib/types";

interface ConversationCardProps {
  conversation: Conversation;
}

const INTENT_LABELS: Record<string, string> = {
  discovery: "Discovery",
  research: "Research",
  comparison: "Comparison",
  decision: "Decision",
  post_purchase: "Post-purchase",
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const userMessages = conversation.messages
    .filter((message) => message.role === "user")
    .slice(0, 3);

  const intentLabel =
    INTENT_LABELS[conversation.intent_stage] ?? conversation.intent_stage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-zinc-200 bg-white shadow-sm">
        <CardHeader className="gap-3 pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-sm leading-snug font-medium text-zinc-900">
              {conversation.persona_summary}
            </CardTitle>
            <Badge
              variant="outline"
              className="shrink-0 border-zinc-200 text-zinc-600"
            >
              {intentLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {userMessages.map((message) => (
              <p
                key={message.turn}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600"
              >
                <span className="mr-2 text-xs font-medium text-zinc-400">
                  Turn {message.turn}
                </span>
                {truncate(message.content, 140)}
              </p>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400">Commercial intent</span>
              <span className="font-medium tabular-nums text-zinc-600">
                {(conversation.commercial_intent_score * 100).toFixed(0)}%
              </span>
            </div>
            <Progress
              value={conversation.commercial_intent_score * 100}
              className="gap-0"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
