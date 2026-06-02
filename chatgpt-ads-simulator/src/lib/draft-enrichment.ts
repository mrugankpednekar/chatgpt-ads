import { resolveCreativeImage } from "./creative-images";
import type { CampaignDraft } from "./types";

export function enrichDraftWithCreativeImages(
  draft: CampaignDraft,
): CampaignDraft {
  let index = 0;
  return {
    ...draft,
    ad_groups: draft.ad_groups.map((group) => ({
      ...group,
      ads: group.ads.map((ad) => {
        const image_url = resolveCreativeImage(ad, index);
        index += 1;
        return { ...ad, image_url };
      }),
    })),
  };
}
