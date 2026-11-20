import type { RefObject } from "react";

import { cn } from "@/lib/utils/cn";

import { HERO_PARTS } from "@/features/scroll-hero/config/parts";
import { HeroPart } from "@/features/scroll-hero/components/HeroPart";

type HeroStageProps = {
  stageRef?: RefObject<HTMLDivElement | null>;
  preloadFirstPart?: boolean;
};

export function HeroStage({ stageRef, preloadFirstPart = false }: HeroStageProps) {
  return (
    <div
      ref={stageRef}
      role="img"
      aria-label="Exploded view of a PC case"
      className="relative h-full w-full [perspective:1200px]"
    >
      <div className="bg-accent/10 absolute top-1/4 left-1/2 size-[28rem] -translate-x-1/2 rounded-full blur-[120px]" />
      <div className="absolute inset-0 mx-auto aspect-square h-full max-h-[88vh] w-auto max-w-full">
        {HERO_PARTS.map((part, index) => (
          <HeroPart key={part.id} part={part} preload={preloadFirstPart && index === 0} />
        ))}
      </div>
      <div
        className={cn(
          "border-surface-800 absolute inset-x-5 bottom-5 hidden h-px border-t md:block",
        )}
      />
    </div>
  );
}
