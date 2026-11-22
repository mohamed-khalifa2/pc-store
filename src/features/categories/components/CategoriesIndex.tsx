import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { CATEGORY_COPY } from "@/features/categories/config/copy";
import { CategoryCard } from "@/features/categories/components/CategoryCard";
import { getCategories } from "@/features/categories/queries/get-categories";

export async function CategoriesIndex() {
  const categories = await getCategories();

  return (
    <Section spacing="tight">
      <Container className="space-y-10">
        <header className="space-y-3">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
            {CATEGORY_COPY.indexEyebrow}
          </p>
          <Heading level={1}>{CATEGORY_COPY.indexTitle}</Heading>
          <p className="text-surface-400 max-w-2xl">{CATEGORY_COPY.indexDescription}</p>
        </header>

        {categories.length === 0 ? (
          <p className="text-surface-400">{CATEGORY_COPY.indexDescription}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
