import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Skeleton";
import { HOME_BADGE_LABEL, HOME_HIGHLIGHTS } from "@/features/home/config/highlights";
import { ROUTES, SITE_DESCRIPTION } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <Section className="border-surface-800 overflow-hidden border-b">
        <Container className="grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <Badge>{HOME_BADGE_LABEL}</Badge>
            <Heading level={1}>
              Power the <span className="text-accent">next build.</span>
            </Heading>
            <p className="text-surface-300 max-w-2xl text-lg leading-relaxed sm:text-xl">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex flex-wrap gap-4">
              <LinkButton href={ROUTES.products} size="lg">
                Shop products
              </LinkButton>
              <LinkButton href={ROUTES.categories} size="lg" variant="secondary">
                Browse categories
              </LinkButton>
            </div>
          </div>

          <div className="rounded-card border-surface-700 bg-surface-900 relative min-h-80 overflow-hidden border p-8">
            <div className="bg-accent/20 absolute top-6 right-6 size-24 rounded-full blur-3xl" />
            <p className="text-accent font-mono text-xs tracking-[0.2em] uppercase">
              System status
            </p>
            <p className="mt-6 text-6xl leading-none font-black text-white">READY</p>
            <div className="mt-10 space-y-4">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="tight">
        <Container className="grid gap-6 md:grid-cols-3">
          {HOME_HIGHLIGHTS.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-card border-surface-800 bg-surface-900/60 border p-8"
            >
              <h2 className="text-xl font-black text-white">{highlight.title}</h2>
              <p className="text-surface-400 mt-3 text-sm leading-relaxed">
                {highlight.description}
              </p>
            </article>
          ))}
        </Container>
      </Section>
    </>
  );
}
