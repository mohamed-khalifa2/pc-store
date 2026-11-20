import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { cn } from "@/lib/utils/cn";

import { HERO_STEPS } from "@/features/scroll-hero/config/steps";

type HeroCopyProps = {
  subtitle?: string | null;
};

export function HeroCopy({ subtitle }: HeroCopyProps) {
  return (
    <div className="from-black-950 via-black-950/70 pointer-events-none absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t to-transparent px-5 pt-32 pb-20 sm:px-8 md:pb-28 lg:px-12">
      {HERO_STEPS.map((step, index) => {
        const isFirst = index === 0;
        const body = isFirst && subtitle ? subtitle : step.body;

        return (
          <div
            key={step.id}
            data-hero-step={step.id}
            className={cn(
              "absolute inset-x-5 bottom-20 space-y-5 sm:inset-x-8 md:bottom-28 lg:inset-x-12",
              isFirst ? "opacity-100" : "invisible opacity-0",
            )}
          >
            <Badge>{step.eyebrow}</Badge>
            <Heading level={isFirst ? 1 : 2} size="display" className="max-w-4xl text-balance">
              {step.title}{" "}
              <span className="text-accent drop-shadow-[0_0_24px_var(--color-accent)]">
                {step.accent}
              </span>
            </Heading>
            <p className="text-surface-200 max-w-xl text-base leading-relaxed sm:text-lg">{body}</p>
            {step.ctaLabel && step.ctaHref && (
              <LinkButton href={step.ctaHref} size="lg" className="pointer-events-auto">
                {step.ctaLabel}
              </LinkButton>
            )}
          </div>
        );
      })}
    </div>
  );
}
