"use client";

import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resolveCreativeImage } from "@/lib/creative-images";
import type { AdDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EditableAdCardProps {
  ad: AdDraft;
  adIndex?: number;
  onChange: (ad: AdDraft) => void;
  onDelete: () => void;
  defaultExpanded?: boolean;
}

export function EditableAdCard({
  ad,
  adIndex = 0,
  onChange,
  onDelete,
  defaultExpanded = false,
}: EditableAdCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const displayName = ad.creative_angle.trim() || ad.title.trim() || "Untitled ad";
  const imageSrc = resolveCreativeImage(ad, adIndex);

  return (
    <div className="rounded-md border border-zinc-200 bg-white">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {expanded ? (
            <ChevronDown className="size-4 shrink-0 text-zinc-400" />
          ) : (
            <ChevronRight className="size-4 shrink-0 text-zinc-400" />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt=""
            className="size-14 shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 object-contain p-1"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-900">
              {displayName}
            </p>
            {!expanded && ad.title && (
              <p className="truncate text-xs text-zinc-500">{ad.title}</p>
            )}
          </div>
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          aria-label="Delete ad"
          className="shrink-0 text-zinc-400 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {expanded && (
        <div className={cn("space-y-4 border-t border-zinc-200 px-3 py-4")}>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={ad.title || displayName}
              className="mx-auto h-56 w-full max-w-md object-contain p-4 sm:h-64"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Ad name / angle</Label>
            <Input
              value={ad.creative_angle}
              onChange={(e) =>
                onChange({ ...ad, creative_angle: e.target.value })
              }
              placeholder="e.g. Price + simplicity"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Headline (title)</Label>
            <Input
              value={ad.title}
              onChange={(e) => onChange({ ...ad, title: e.target.value })}
              placeholder="16–24 characters"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Description</Label>
            <Textarea
              value={ad.description}
              onChange={(e) =>
                onChange({ ...ad, description: e.target.value })
              }
              placeholder="32–48 characters"
              rows={2}
              className="resize-none bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Landing page (CTA URL)</Label>
            <Input
              value={ad.landing_page}
              onChange={(e) =>
                onChange({ ...ad, landing_page: e.target.value })
              }
              placeholder="https://example.com/page"
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-500">Image URL</Label>
            <Input
              value={ad.image_url ?? ""}
              onChange={(e) =>
                onChange({ ...ad, image_url: e.target.value })
              }
              placeholder="/creative-assets/ad_1.svg"
              className="bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}
