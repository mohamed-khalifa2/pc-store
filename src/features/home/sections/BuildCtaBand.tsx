import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { ROUTES } from "@/lib/constants";
import { safeHref } from "@/lib/format/safe-href";

import type { HomeSection } from "@/features/home/types";

type BuildCtaBandProps = {
  section: HomeSection;
};

export function BuildCtaBand({ section }: BuildCtaBandProps) {
  const href = safeHref(section.config.href, ROUTES.products);
  const label = section.config.label ?? "Start a build";

  return (
    <Section spacing="tight" className="bg-accent text-black-950">
      <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <p className="font-mono text-xs font-black tracking-[0.2em] uppercase">Build desk</p>
          <Heading level={2} tone="inverse">
            {section.title ?? "Build with confidence"}
          </Heading>
          {section.subtitle && (
            <p className="max-w-xl text-base font-semibold">{section.subtitle}</p>
          )}
        </div>
        <LinkButton
          href={href}
          size="lg"
          variant="secondary"
          className="border-black-950 bg-black-950 text-accent hover:border-black-900 hover:bg-black-900 hover:text-accent-soft"
        >
          {label}
        </LinkButton>
      </Container>
    </Section>
  );
}
