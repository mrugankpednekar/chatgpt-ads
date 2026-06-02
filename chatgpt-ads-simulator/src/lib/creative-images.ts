export const CREATIVE_IMAGE_PATHS = [
  "/creative-assets/ad_1.svg",
  "/creative-assets/ad_2.svg",
  "/creative-assets/ad_3.svg",
  "/creative-assets/ad_4.svg",
  "/creative-assets/ad_5.svg",
  "/creative-assets/ad_6.svg",
  "/creative-assets/ad_7.svg",
  "/creative-assets/ad_8.svg",
] as const;

const CREATIVE_IMAGE_SET = new Set<string>(CREATIVE_IMAGE_PATHS);

export function defaultCreativeImage(index: number): string {
  return CREATIVE_IMAGE_PATHS[index % CREATIVE_IMAGE_PATHS.length];
}

export function resolveCreativeImage(
  ad: { id: string; image_url?: string },
  index = 0,
): string {
  const trimmed = ad.image_url?.trim();
  if (trimmed) return trimmed;

  const idPath = `/creative-assets/${ad.id}.svg`;
  if (CREATIVE_IMAGE_SET.has(idPath)) return idPath;

  return defaultCreativeImage(index);
}
