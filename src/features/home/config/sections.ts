import type { BannerVariant } from "@/features/banners/config/variants";

export const HOME_SECTION_KIND = {
  hero: "hero",
  marquee: "marquee",
  banners: "banners",
  featuredCategories: "featured_categories",
  featuredProducts: "featured_products",
  buildCta: "build_cta",
  whyUs: "why_us",
  newsletter: "newsletter",
  footerCta: "footer_cta",
} as const;

export type HomeSectionKind = (typeof HOME_SECTION_KIND)[keyof typeof HOME_SECTION_KIND];

export const LEGACY_SECTION_KINDS: Record<string, HomeSectionKind> = {
  category_grid: HOME_SECTION_KIND.featuredCategories,
  banner_carousel: HOME_SECTION_KIND.banners,
  rich_text: HOME_SECTION_KIND.whyUs,
};

export const VISIBLE_SECTION_KINDS = Object.values(HOME_SECTION_KIND) as HomeSectionKind[];

export const DEFAULT_SECTION_LIMITS = {
  banners: 3,
  categories: 6,
  products: 4,
} as const;

export const DEFAULT_BANNER_VARIANTS: readonly BannerVariant[] = ["full", "split", "strip"];
