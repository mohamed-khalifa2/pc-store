import { ScrollHeroLoader } from "@/features/home/components/ScrollHeroLoader";
import type { HomeSection } from "@/features/home/types";

type HomeHeroSectionProps = {
  section: HomeSection;
};

export function HomeHeroSection({ section }: HomeHeroSectionProps) {
  return <ScrollHeroLoader title={section.title} subtitle={section.subtitle} />;
}
