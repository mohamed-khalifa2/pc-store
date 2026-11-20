"use client";

import dynamic from "next/dynamic";

import { HeroStatic } from "@/features/scroll-hero/components/HeroStatic";

const ScrollHero = dynamic(
  () => import("@/features/scroll-hero/components/ScrollHero").then((module) => module.ScrollHero),
  { ssr: false, loading: () => <HeroStatic /> },
);

type ScrollHeroLoaderProps = {
  title?: string | null;
  subtitle?: string | null;
};

export function ScrollHeroLoader({ title, subtitle }: ScrollHeroLoaderProps) {
  return <ScrollHero title={title} subtitle={subtitle} />;
}
