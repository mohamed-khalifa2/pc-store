import Image from "next/image";

import { BLUR_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import { HERO_PART_SIZE, type HeroPartConfig } from "@/features/scroll-hero/config/parts";
import { heroZIndexClass } from "@/features/scroll-hero/lib/z-index";

type HeroPartProps = {
  part: HeroPartConfig;
  preload?: boolean;
};

export function HeroPart({ part, preload = false }: HeroPartProps) {
  return (
    <div
      data-hero-part={part.id}
      className={cn(
        "absolute inset-0",
        heroZIndexClass(part.zIndex),
        !part.mobile && "hidden md:block",
      )}
    >
      <Image
        src={part.image}
        alt=""
        width={HERO_PART_SIZE}
        height={HERO_PART_SIZE}
        sizes="(max-width: 768px) 90vw, 55vw"
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        preload={preload}
        draggable={false}
        className="h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}
