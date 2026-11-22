import type { Banner } from "@/features/banners/types";
import type { CategoryCardData } from "@/features/categories/types";
import { BannersSection } from "@/features/home/sections/BannersSection";
import { BrandMarquee } from "@/features/home/sections/BrandMarquee";
import { BuildCtaBand } from "@/features/home/sections/BuildCtaBand";
import { FooterCtaSection } from "@/features/home/sections/FooterCtaSection";
import { HomeHeroSection } from "@/features/home/sections/HomeHeroSection";
import { HOME_SECTION_KIND } from "@/features/home/config/sections";
import { NewsletterSection } from "@/features/home/sections/NewsletterSection";
import { FeaturedCategoriesSection } from "@/features/home/sections/FeaturedCategoriesSection";
import { FeaturedProductsSection } from "@/features/home/sections/FeaturedProductsSection";
import { WhyUsSection } from "@/features/home/sections/WhyUsSection";
import type { HomeSection } from "@/features/home/types";
import type { ProductCardData } from "@/features/products/types";
import type { SiteContent } from "@/features/site-content/types";

type HomeSectionRendererProps = {
  section: HomeSection;
  banners: Banner[];
  categories: CategoryCardData[];
  products: ProductCardData[];
  content: SiteContent;
};

export function HomeSectionRenderer({
  section,
  banners,
  categories,
  products,
  content,
}: HomeSectionRendererProps) {
  switch (section.kind) {
    case HOME_SECTION_KIND.hero:
      return <HomeHeroSection section={section} content={content} />;
    case HOME_SECTION_KIND.marquee:
      return <BrandMarquee section={section} />;
    case HOME_SECTION_KIND.banners:
      return <BannersSection section={section} banners={banners} />;
    case HOME_SECTION_KIND.featuredCategories:
      return <FeaturedCategoriesSection section={section} categories={categories} />;
    case HOME_SECTION_KIND.featuredProducts:
      return <FeaturedProductsSection section={section} products={products} />;
    case HOME_SECTION_KIND.buildCta:
      return <BuildCtaBand section={section} />;
    case HOME_SECTION_KIND.whyUs:
      return <WhyUsSection section={section} />;
    case HOME_SECTION_KIND.newsletter:
      return <NewsletterSection section={section} />;
    case HOME_SECTION_KIND.footerCta:
      return <FooterCtaSection section={section} />;
  }
}
