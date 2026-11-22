import { ScrollHeroLoader } from "@/features/home/components/ScrollHeroLoader";
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

  return <ScrollHeroLoader title={title} subtitle={subtitle} steps={getHeroSteps(content)} />;
}
