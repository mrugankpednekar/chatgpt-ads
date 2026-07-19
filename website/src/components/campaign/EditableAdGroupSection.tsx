"use client";

import { ChevronDown, ChevronRight, Plus } from "lucide-react";

import { EditableContextHints } from "@/components/EditableContextHints";
import { EditableAdCard } from "@/components/campaign/EditableAdCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  addAdToGroup,
  removeAdFromGroup,
  updateAdGroupHints,
  updateAdGroupMeta,
  updateAdInGroup,
} from "@/lib/draft-mutations";
import type { AdDraft, AdGroupDraft, CampaignDraft } from "@/lib/types";

interface EditableAdGroupSectionProps {
  group: AdGroupDraft;
  draft: CampaignDraft;
  onChange: (draft: CampaignDraft) => void;
  expanded: boolean;
  onToggle: () => void;
}

export function EditableAdGroupSection({
  group,
  draft,
  onChange,
  expanded,
  onToggle,
}: EditableAdGroupSectionProps) {
  const handleHintsChange = (hints: typeof group.context_hints) => {
    onChange(updateAdGroupHints(draft, group.id, hints));
  };

  const handleAddAd = () => {
    onChange(addAdToGroup(draft, group.id));
  };

  const handleDeleteAd = (adId: string) => {
    onChange(removeAdFromGroup(draft, group.id, adId));
  };

  const handleAdChange = (adId: string, next: AdDraft) => {
    onChange(updateAdInGroup(draft, group.id, adId, next));
  };

  return (
    <div className="surface overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <p className="font-medium text-zinc-900">{group.name}</p>
          <p className="mt-0.5 line-clamp-2 text-sm text-zinc-500">
            {group.persona_summary}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{group.intent_stage}</Badge>
          {expanded ? (
            <ChevronDown className="size-4 text-zinc-400" />
          ) : (
            <ChevronRight className="size-4 text-zinc-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-6 border-t border-zinc-200 px-5 py-4">
          <div className="space-y-2">
            <p className="label-mono">Persona summary</p>
            <Textarea
              value={group.persona_summary}
              onChange={(e) =>
                onChange(
                  updateAdGroupMeta(draft, group.id, {
                    persona_summary: e.target.value,
                  }),
                )
              }
              rows={2}
              className="resize-none bg-white text-sm"
            />
          </div>

          <EditableContextHints
            hints={group.context_hints}
            onChange={handleHintsChange}
            onTestHints={() => {}}
            showTestButton={false}
            compact
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="label-mono">Ads & creatives</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAd}
              >
                <Plus className="mr-1 size-4" />
                Add ad
              </Button>
            </div>
            {group.ads.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No ads yet. Add one to define creative variants.
              </p>
            ) : (
              <div className="space-y-2">
                {group.ads.map((ad, index) => (
                  <EditableAdCard
                    key={ad.id}
                    ad={ad}
                    adIndex={index}
                    defaultExpanded={index === 0 && group.ads.length === 1}
                    onChange={(next) => handleAdChange(ad.id, next)}
                    onDelete={() => handleDeleteAd(ad.id)}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs text-zinc-500">
            Max CPC ${group.max_cpc_bid_usd} · {group.budget_allocation_pct}%
            budget
          </p>
        </div>
      )}
    </div>
  );
}
