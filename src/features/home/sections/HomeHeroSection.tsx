import { resolveAssetUrl } from "@/lib/format/asset-url";
import { STORAGE_BUCKETS } from "@/lib/constants";

import { ScrollHeroLoader } from "@/features/home/components/ScrollHeroLoader";
import { HERO_ARTWORK } from "@/features/scroll-hero/config/hero-artwork";
import { getHeroSteps } from "@/features/scroll-hero/lib/hero-steps-from-content";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import type { SiteContent } from "@/features/site-content/types";
import type { HomeSection } from "@/features/home/types";

type HomeHeroSectionProps = {
  section: HomeSection;
  content: SiteContent;
};

export function HomeHeroSection({ section, content }: HomeHeroSectionProps) {
  const title = getSiteText(content, SITE_CONTENT_KEYS.heroTitle, section.title ?? "");
  const subtitle = getSiteText(content, SITE_CONTENT_KEYS.heroSubtitle, section.subtitle ?? "");
  const imagePath = getSiteText(content, SITE_CONTENT_KEYS.heroImage, HERO_ARTWORK.src);
  const imageAlt = getSiteText(content, SITE_CONTENT_KEYS.heroImageAlt, HERO_ARTWORK.alt);
  const imageSrc = resolveAssetUrl(imagePath, STORAGE_BUCKETS.siteAssets, HERO_ARTWORK.src);

  return (
    <ScrollHeroLoader
      title={title}
      subtitle={subtitle}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      steps={getHeroSteps(content)}
    />
  );
}
