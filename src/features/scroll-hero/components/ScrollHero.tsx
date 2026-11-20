"use client";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { HeroCopy } from "@/features/scroll-hero/components/HeroCopy";
import { HeroStage } from "@/features/scroll-hero/components/HeroStage";
import { HeroStatic } from "@/features/scroll-hero/components/HeroStatic";
import { SmoothScrollProvider } from "@/features/scroll-hero/components/SmoothScrollProvider";
import { useHeroTimeline } from "@/features/scroll-hero/hooks/useHeroTimeline";

type ScrollHeroProps = {
  title?: string | null;
  subtitle?: string | null;
};

export function ScrollHero({ title, subtitle }: ScrollHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useHeroTimeline({ rootRef, stageRef, enabled: !reducedMotion });

  if (reducedMotion) {
    return (
      <section aria-label="PC case overview">
        <HeroStatic title={title} subtitle={subtitle} />
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      aria-label="Interactive PC case build"
      className="relative h-[240vh] md:h-[400vh]"
    >
      <SmoothScrollProvider />
      <div ref={stageRef} className="relative h-screen overflow-hidden">
        <HeroStage preloadFirstPart />
        <HeroCopy subtitle={subtitle} />
      </div>
    </section>
  );
}
