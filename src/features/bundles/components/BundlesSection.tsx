import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { ROUTES } from "@/lib/constants";

import { BundleCard } from "@/features/bundles/components/BundleCard";
import { BUNDLE_COPY } from "@/features/bundles/config/copy";
import type { Bundle } from "@/features/bundles/types";

type BundlesSectionProps = {
  bundles: Bundle[];
  eyebrow?: string;
  title?: string;
  description?: string;
  showViewAll?: boolean;
  headingLevel?: 1 | 2;
};

export function BundlesSection({
  bundles,
  eyebrow = BUNDLE_COPY.eyebrow,
  title = BUNDLE_COPY.title,
  description = BUNDLE_COPY.description,
  showViewAll = false,
  headingLevel = 2,
}: BundlesSectionProps) {
  if (bundles.length === 0) return null;

  return (
    <Section className="border-surface-800 border-b">
      <Container className="space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">{eyebrow}</p>
            <Heading level={headingLevel}>{title}</Heading>
            <p className="text-surface-400 max-w-2xl text-lg">{description}</p>
          </div>
          {showViewAll && <LinkButton href={ROUTES.products}>{BUNDLE_COPY.viewAll}</LinkButton>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} headingLevel={headingLevel === 1 ? 2 : 3} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
