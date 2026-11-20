import type { BannerVariant } from "@/features/banners/config/variants";

export type Banner = {
  id: string;
  name: string;
  headline: string;
  subheadline: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  imageUrl: string;
  variant: BannerVariant;
};
