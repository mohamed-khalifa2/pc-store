import { z } from "zod";

import { getActiveBanners } from "@/features/banners/queries/get-active-banners";
import { getFeaturedCategories } from "@/features/categories/queries/get-featured-categories";
import {
  DEFAULT_BANNER_VARIANTS,
  DEFAULT_SECTION_LIMITS,
  HOME_SECTION_KIND,
} from "@/features/home/config/sections";
import { getHomeSections } from "@/features/home/queries/get-home-sections";
import { getFeaturedProducts } from "@/features/products/queries/get-featured-products";
import { getSiteContent } from "@/features/site-content/queries/get-site-content";
import type { HomePageData, HomeSection } from "@/features/home/types";

function getSection(kind: HomeSection["kind"], sections: HomeSection[]): HomeSection | undefined {
  return sections.find((section) => section.kind === kind);
}

function getLimit(value: number | undefined, fallback: number): number {
  return z
    .number()
    .int()
    .min(1)
    .max(12)
    .catch(fallback)
    .parse(value ?? fallback);
}

export async function getHomePageData(): Promise<HomePageData> {
  const [sections, content, allBanners] = await Promise.all([
    getHomeSections(),
    getSiteContent(),
    getActiveBanners(),
  ]);

  const bannerSection = getSection(HOME_SECTION_KIND.banners, sections);
  const bannerLimit = getLimit(bannerSection?.config.limit, DEFAULT_SECTION_LIMITS.banners);
  const variants = bannerSection?.config.variants?.length
    ? bannerSection.config.variants
    : DEFAULT_BANNER_VARIANTS;
  const banners = allBanners.slice(0, bannerLimit).map((banner, index) => ({
    ...banner,
    variant: variants[index % variants.length],
  }));

  const categorySection = getSection(HOME_SECTION_KIND.featuredCategories, sections);
  const productSection = getSection(HOME_SECTION_KIND.featuredProducts, sections);

  const [categories, products] = await Promise.all([
    getFeaturedCategories(
      getLimit(categorySection?.config.limit, DEFAULT_SECTION_LIMITS.categories),
    ),
    getFeaturedProducts(getLimit(productSection?.config.limit, DEFAULT_SECTION_LIMITS.products)),
  ]);

  return { sections, banners, categories, products, content };
}
