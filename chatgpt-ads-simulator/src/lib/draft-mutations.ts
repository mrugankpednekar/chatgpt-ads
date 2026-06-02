import type {
  AdDraft,
  AdGroupDraft,
  CampaignDraft,
  ContextHintDraft,
} from "./types";

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyHint(): ContextHintDraft {
  return {
    id: generateId("hint"),
    text: "",
    pattern: "question",
  };
}

export function createEmptyAd(): AdDraft {
  return {
    id: generateId("ad"),
    title: "",
    description: "",
    landing_page: "",
    creative_angle: "New ad",
    image_url: "",
  };
}

export function updateAdGroupInDraft(
  draft: CampaignDraft,
  adGroupId: string,
  updater: (group: AdGroupDraft) => AdGroupDraft,
): CampaignDraft {
  return {
    ...draft,
    ad_groups: draft.ad_groups.map((group) =>
      group.id === adGroupId ? updater(group) : group,
    ),
  };
}

export function updateAdGroupHints(
  draft: CampaignDraft,
  adGroupId: string,
  hints: ContextHintDraft[],
): CampaignDraft {
  return updateAdGroupInDraft(draft, adGroupId, (group) => ({
    ...group,
    context_hints: hints,
  }));
}

export function addAdToGroup(
  draft: CampaignDraft,
  adGroupId: string,
  ad: AdDraft = createEmptyAd(),
): CampaignDraft {
  return updateAdGroupInDraft(draft, adGroupId, (group) => ({
    ...group,
    ads: [...group.ads, ad],
  }));
}

export function removeAdFromGroup(
  draft: CampaignDraft,
  adGroupId: string,
  adId: string,
): CampaignDraft {
  return updateAdGroupInDraft(draft, adGroupId, (group) => ({
    ...group,
    ads: group.ads.filter((ad) => ad.id !== adId),
  }));
}

export function updateAdInGroup(
  draft: CampaignDraft,
  adGroupId: string,
  adId: string,
  patch: Partial<AdDraft>,
): CampaignDraft {
  return updateAdGroupInDraft(draft, adGroupId, (group) => ({
    ...group,
    ads: group.ads.map((ad) =>
      ad.id === adId ? { ...ad, ...patch } : ad,
    ),
  }));
}

export function updateAdGroupMeta(
  draft: CampaignDraft,
  adGroupId: string,
  patch: Partial<Pick<AdGroupDraft, "name" | "persona_summary">>,
): CampaignDraft {
  return updateAdGroupInDraft(draft, adGroupId, (group) => ({
    ...group,
    ...patch,
  }));
}
