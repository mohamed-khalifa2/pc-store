"use client";

import dynamic from "next/dynamic";

import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";
import { HeroStatic } from "@/features/scroll-hero/components/HeroStatic";

const ScrollHero = dynamic(
  () => import("@/features/scroll-hero/components/ScrollHero").then((module) => module.ScrollHero),
  { ssr: false, loading: () => <HeroStatic /> },
);

type ScrollHeroLoaderProps = {
  title?: string | null;
  subtitle?: string | null;
  steps?: readonly HeroStep[];
};

export function ScrollHeroLoader({ title, subtitle, steps = HERO_STEPS }: ScrollHeroLoaderProps) {
  return <ScrollHero title={title} subtitle={subtitle} steps={steps} />;
}
