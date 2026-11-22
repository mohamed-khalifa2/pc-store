"use client";

import { useMemo, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useWebGLSupport } from "@/hooks/use-webgl-support";

import { HeroCopy } from "@/features/scroll-hero/components/HeroCopy";
import { HeroModelStage } from "@/features/scroll-hero/components/HeroModelStage";
import { HeroStatic } from "@/features/scroll-hero/components/HeroStatic";
import { SmoothScrollProvider } from "@/features/scroll-hero/components/SmoothScrollProvider";
import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";
import { useHeroTimeline } from "@/features/scroll-hero/hooks/useHeroTimeline";
import { createHeroRuntime } from "@/features/scroll-hero/lib/hero-runtime";

type ScrollHeroProps = {
  title?: string | null;
  subtitle?: string | null;
  steps?: readonly HeroStep[];
};

export function ScrollHero({ title, subtitle, steps = HERO_STEPS }: ScrollHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const webGLAvailable = useWebGLSupport();
  const rootRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const runtime = useMemo(() => createHeroRuntime(), []);

  useHeroTimeline({
    rootRef,
    stageRef,
    runtime,
    enabled: !reducedMotion && webGLAvailable,
  });

  if (reducedMotion || !webGLAvailable) {
    return (
      <section aria-label="PC case overview">
        <HeroStatic title={title} subtitle={subtitle} steps={steps} />
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
        <HeroModelStage runtime={runtime} />
        <HeroCopy steps={steps} subtitle={subtitle} />
      </div>
    </section>
  );
}
