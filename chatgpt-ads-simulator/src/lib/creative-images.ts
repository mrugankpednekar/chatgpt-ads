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

export function defaultCreativeImage(index: number): string {
  return CREATIVE_IMAGE_PATHS[index % CREATIVE_IMAGE_PATHS.length];
}
