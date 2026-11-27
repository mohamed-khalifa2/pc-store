import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ROUTES } from "@/lib/constants";

import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";

const BROWSE_LABEL = "Browse categories";

type HeroCopyProps = {
  title?: string | null;
  subtitle?: string | null;
  steps?: readonly HeroStep[];
};

export function HeroCopy({ title, subtitle, steps = HERO_STEPS }: HeroCopyProps) {
  const firstStep = steps[0]!;
  const lastStep = steps[steps.length - 1]!;
  const headline = title ?? [firstStep.title, firstStep.accent].filter(Boolean).join(" ");

  return (
    <div className="max-w-2xl space-y-6">
      <Heading level={1} size="display" className="text-balance">
        {headline}
      </Heading>
      <p className="text-surface-200 max-w-xl text-base leading-relaxed sm:text-lg">
        {subtitle ?? firstStep.body}
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <LinkButton href={lastStep.ctaHref ?? ROUTES.products} size="lg">
          {lastStep.ctaLabel ?? "Shop components"}
        </LinkButton>
        <LinkButton href={ROUTES.categories} variant="secondary" size="lg">
          {BROWSE_LABEL}
        </LinkButton>
      </div>
    </div>
  );
}
