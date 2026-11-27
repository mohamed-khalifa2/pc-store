"use client";

import dynamic from "next/dynamic";

import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";
import { HeroHeader } from "@/features/scroll-hero/components/HeroHeader";

const ScrollHero = dynamic(
  () => import("@/features/scroll-hero/components/ScrollHero").then((module) => module.ScrollHero),
  { ssr: false, loading: () => <HeroHeader /> },
);

type ScrollHeroLoaderProps = {
  title?: string | null;
  subtitle?: string | null;
  imageSrc?: string;
  imageAlt?: string;
  steps?: readonly HeroStep[];
};

export function ScrollHeroLoader({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  steps = HERO_STEPS,
}: ScrollHeroLoaderProps) {
  return (
    <ScrollHero
      title={title}
      subtitle={subtitle}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
      steps={steps}
    />
  );
}
