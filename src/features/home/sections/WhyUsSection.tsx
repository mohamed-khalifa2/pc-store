import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { DEFAULT_TRUST_POINTS } from "@/features/home/config/brand-items";
import { WHY_US_ICONS } from "@/features/home/config/why-us-icons";
import type { HomeSection } from "@/features/home/types";

type WhyUsSectionProps = {
  section: HomeSection;
};

export function WhyUsSection({ section }: WhyUsSectionProps) {
  const rawPoints = section.body.points;
  const points = Array.isArray(rawPoints)
    ? rawPoints.filter((point): point is string => typeof point === "string")
    : [...DEFAULT_TRUST_POINTS];
  const badges = points.length > 0 ? points : [...DEFAULT_TRUST_POINTS];

  return (
    <Section className="border-surface-800 border-b">
      <Container className="space-y-10">
        <div className="space-y-3">
          <Heading level={2}>{section.title ?? "Why PC//STORE"}</Heading>
          {section.subtitle && <p className="text-surface-400 text-lg">{section.subtitle}</p>}
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((point, index) => {
            const Icon = WHY_US_ICONS[index % WHY_US_ICONS.length]!;

            return (
              <li
                key={`${point}-${index}`}
                className="rounded-card border-surface-800 bg-surface-900/60 hover:border-accent-strong border p-6 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="bg-accent/10 text-accent grid size-11 place-items-center rounded-xl">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-surface-400 font-mono text-xs font-black tracking-[0.2em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-black text-white">{point}</h3>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
