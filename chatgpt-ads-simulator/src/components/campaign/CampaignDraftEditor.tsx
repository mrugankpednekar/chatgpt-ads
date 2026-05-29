"use client";

import { useState } from "react";

import { EditableAdGroupSection } from "@/components/campaign/EditableAdGroupSection";
import type { CampaignDraft } from "@/lib/types";

interface CampaignDraftEditorProps {
  draft: CampaignDraft;
  onChange: (draft: CampaignDraft) => void;
}

export function CampaignDraftEditor({
  draft,
  onChange,
}: CampaignDraftEditorProps) {
  const [expanded, setExpanded] = useState<string | null>(
    draft.ad_groups[0]?.id ?? null,
  );

  return (
    <div className="space-y-3">
      {draft.ad_groups.map((group) => (
        <EditableAdGroupSection
          key={group.id}
          group={group}
          draft={draft}
          onChange={onChange}
          expanded={expanded === group.id}
          onToggle={() =>
            setExpanded((current) =>
              current === group.id ? null : group.id,
            )
          }
        />
      ))}
    </div>
  );
}
