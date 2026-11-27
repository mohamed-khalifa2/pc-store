import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import type { StaticPageDefinition } from "@/features/site-content/config/static-pages";

const PARAGRAPH_CLASS = "text-surface-400 text-base leading-relaxed sm:text-lg";
const LIST_CLASS = "text-surface-200 mt-5 space-y-3 text-sm sm:text-base";

type StaticPageViewProps = {
  page: StaticPageDefinition;
};

export function StaticPageView({ page }: StaticPageViewProps) {
  return (
    <Section spacing="tight">
      <Container className="space-y-14">
        <header className="border-surface-800 max-w-4xl space-y-6 border-b pb-10">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
            {page.eyebrow}
          </p>
          <Heading level={1} size="section">
            {page.title}
          </Heading>
          <p className={PARAGRAPH_CLASS}>{page.description}</p>
          {page.updated && (
            <p className="text-surface-400 text-xs font-bold tracking-[0.16em] uppercase">
              {page.updated}
            </p>
          )}
        </header>

        <div className="max-w-4xl space-y-12">
          {page.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <Heading level={2} size="card">
                {section.heading}
              </Heading>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={PARAGRAPH_CLASS}>
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className={LIST_CLASS}>
                  {section.items.map((item) => (
                    <li key={item} className="border-surface-800 border-l-2 pl-4">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
