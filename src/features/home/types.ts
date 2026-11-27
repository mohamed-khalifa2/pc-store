import type { Banner } from "@/features/banners/types";
import type { Bundle } from "@/features/bundles/types";
import type { CategoryCardData } from "@/features/categories/types";
import type { ProductCardData } from "@/features/products/types";
import type { SiteContent } from "@/features/site-content/types";

import type { BannerVariant } from "@/features/banners/config/variants";
import type { HomeSectionKind } from "@/features/home/config/sections";

export type HomeSectionConfig = {
  limit?: number;
  variants?: BannerVariant[];
  items?: string[];
  href?: string;
  label?: string;
};

export type HomeSectionBody = Record<string, unknown>;

export type HomeSection = {
  id: string;
  key: string;
  kind: HomeSectionKind;
  title: string | null;
  subtitle: string | null;
  body: HomeSectionBody;
  config: HomeSectionConfig;
  sortOrder: number;
};

export type HomePageData = {
  sections: HomeSection[];
  banners: Banner[];
  categories: CategoryCardData[];
  products: ProductCardData[];
  bundles: Bundle[];
  content: SiteContent;
};
