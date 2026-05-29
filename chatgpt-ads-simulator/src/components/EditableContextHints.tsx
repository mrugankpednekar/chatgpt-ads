"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ContextHintDraft } from "@/lib/types";

function generateHintId(): string {
  return `hint_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

interface EditableContextHintsProps {
  hints: ContextHintDraft[];
  onChange: (hints: ContextHintDraft[]) => void;
  onTestHints?: () => void;
  isTesting?: boolean;
  showTestButton?: boolean;
  compact?: boolean;
}

export function EditableContextHints({
  hints,
  onChange,
  onTestHints,
  isTesting = false,
  showTestButton = true,
  compact = false,
}: EditableContextHintsProps) {
  const updateHint = (index: number, text: string) => {
    const next = hints.map((hint, i) =>
      i === index ? { ...hint, text } : hint,
    );
    onChange(next);
  };

  const removeHint = (index: number) => {
    onChange(hints.filter((_, i) => i !== index));
  };

  const addHint = () => {
    onChange([
      ...hints,
      {
        id: generateHintId(),
        text: "",
        pattern: "question",
      },
    ]);
  };

  const nonEmptyCount = hints.filter((h) => h.text.trim()).length;

  const content = (
    <>
        {hints.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No context hints yet. Add one to test.
          </p>
        ) : (
          <ul className="space-y-2">
            {hints.map((hint, index) => (
              <li key={hint.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={hint.text}
                  onChange={(e) => updateHint(index, e.target.value)}
                  placeholder="e.g. best vitamin c serum for teens"
                  className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={() => removeHint(index)}
                  className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label="Remove hint"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={addHint}>
          <Plus className="mr-1 size-4" />
          Add hint
        </Button>
        {showTestButton && onTestHints ? (
          <Button
            type="button"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={onTestHints}
            disabled={isTesting || nonEmptyCount === 0}
          >
            {isTesting ? "Running…" : "Test hints"}
          </Button>
        ) : null}
      </div>
    </>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        <p className="label-mono">Context hints</p>
        {content}
      </div>
    );
  }

  return (
    <Card className="border border-border bg-card shadow-none">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-sm font-medium text-foreground">
          Edit context hints
        </CardTitle>
        <CardDescription>
          Change hints below, then re-run simulation to see updated scores.
          Changes are saved to your campaign draft.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6 pt-0">{content}</CardContent>
    </Card>
  );
}
