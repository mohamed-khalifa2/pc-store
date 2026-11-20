import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ROUTES } from "@/lib/constants";

import { HERO_STEPS } from "@/features/scroll-hero/config/steps";
import { HeroStage } from "@/features/scroll-hero/components/HeroStage";

type HeroStaticProps = {
  title?: string | null;
  subtitle?: string | null;
};

export function HeroStatic({ title, subtitle }: HeroStaticProps) {
  const firstStep = HERO_STEPS[0];
  const lastStep = HERO_STEPS[HERO_STEPS.length - 1];
  const headline = `${firstStep.title} ${firstStep.accent}`;

  return (
    <div className="relative h-screen min-h-[36rem] overflow-hidden">
      <HeroStage preloadFirstPart />
      <div className="from-black-950 via-black-950/70 absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t to-transparent px-5 pt-28 pb-20 sm:px-8 lg:px-12">
        <div className="max-w-container-store mx-auto space-y-5">
          <Badge>{title ?? firstStep.eyebrow}</Badge>
          <Heading level={1} size="display" className="max-w-4xl">
            {headline}
          </Heading>
          <p className="text-surface-200 max-w-xl text-base leading-relaxed sm:text-lg">
            {subtitle ?? firstStep.body}
          </p>
          <LinkButton href={lastStep.ctaHref ?? ROUTES.products} size="lg">
            {lastStep.ctaLabel ?? "Shop components"}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
