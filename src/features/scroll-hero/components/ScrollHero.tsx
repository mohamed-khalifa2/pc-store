"use client";

import { useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { HeroHeader } from "@/features/scroll-hero/components/HeroHeader";
import { SmoothScrollProvider } from "@/features/scroll-hero/components/SmoothScrollProvider";
import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";
import { useHeroParallax } from "@/features/scroll-hero/hooks/useHeroParallax";

type ScrollHeroProps = {
  title?: string | null;
  subtitle?: string | null;
  imageSrc?: string;
  imageAlt?: string;
  steps?: readonly HeroStep[];
};

export function ScrollHero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  steps = HERO_STEPS,
}: ScrollHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useHeroParallax({
    rootRef,
    imageRef,
    glowRef,
    copyRef,
    enabled: !reducedMotion,
  });

  return (
    <section ref={rootRef} aria-label="Featured PC build" className="relative isolate">
      <SmoothScrollProvider />
      <HeroHeader
        title={title}
        subtitle={subtitle}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        steps={steps}
        imageRef={imageRef}
        glowRef={glowRef}
        copyRef={copyRef}
        interactive={!reducedMotion}
      />
    </section>
  );
}
