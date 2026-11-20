export const BANNER_VARIANTS = ["full", "split", "strip"] as const;

export type BannerVariant = (typeof BANNER_VARIANTS)[number];
