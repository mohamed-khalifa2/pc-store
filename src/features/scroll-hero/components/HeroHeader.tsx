import type { RefObject } from "react";

import { HeroArtwork } from "@/features/scroll-hero/components/HeroArtwork";
import { HeroCopy } from "@/features/scroll-hero/components/HeroCopy";
import { HeroFeatureIcons } from "@/features/scroll-hero/components/HeroFeatureIcons";
import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";

type HeroHeaderProps = {
  title?: string | null;
  subtitle?: string | null;
  imageSrc?: string;
  imageAlt?: string;
  steps?: readonly HeroStep[];
  imageRef?: RefObject<HTMLDivElement | null>;
  glowRef?: RefObject<HTMLDivElement | null>;
  copyRef?: RefObject<HTMLDivElement | null>;
  interactive?: boolean;
};

export function HeroHeader({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  steps = HERO_STEPS,
  imageRef,
  glowRef,
  copyRef,
  interactive = false,
}: HeroHeaderProps) {
  return (
    <div className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden">
      <div
        ref={glowRef}
        aria-hidden="true"
        className="animate-hero-glow bg-accent/10 pointer-events-none absolute -top-40 -right-24 size-[38rem] rounded-full blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="from-black-950 via-black-900 to-black-950 pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80"
      />

      <div className="max-w-container-store relative mx-auto grid min-h-0 flex-1 items-center gap-10 px-5 py-12 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12 lg:py-12">
        <div ref={copyRef} className="order-2 lg:order-1">
          <HeroCopy title={title} subtitle={subtitle} steps={steps} />
        </div>
        <div className="order-1 lg:order-2">
          <HeroArtwork
            src={imageSrc}
            alt={imageAlt}
            imageRef={imageRef}
            interactive={interactive}
          />
        </div>
      </div>

      <HeroFeatureIcons />
    </div>
  );
}
