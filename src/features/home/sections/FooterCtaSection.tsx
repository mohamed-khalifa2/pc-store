import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { ROUTES } from "@/lib/constants";
import { safeHref } from "@/lib/format/safe-href";

import type { HomeSection } from "@/features/home/types";

type FooterCtaSectionProps = {
  section: HomeSection;
};

export function FooterCtaSection({ section }: FooterCtaSectionProps) {
  const href = safeHref(section.config.href, ROUTES.products);
  const label = section.config.label ?? "Shop all parts";

  return (
    <Section className="border-surface-800 border-t">
      <Container className="space-y-8 py-20 text-center">
        <p className="text-accent font-mono text-xs font-black tracking-[0.24em] uppercase">
          The next build
        </p>
        <Heading level={2} size="display" className="mx-auto max-w-4xl text-balance">
          {section.title ?? "Ready to upgrade?"}
        </Heading>
        {section.subtitle && (
          <p className="text-surface-300 mx-auto max-w-xl text-lg">{section.subtitle}</p>
        )}
        <LinkButton href={href} size="lg">
          {label}
        </LinkButton>
      </Container>
    </Section>
  );
}
