import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { ROUTES } from "@/lib/constants";

import { CATEGORY_COPY } from "@/features/categories/config/copy";
import { CategoryHero } from "@/features/categories/components/CategoryHero";
import { getCategoryBySlug } from "@/features/categories/queries/get-category-by-slug";
import { ProductFilterForm } from "@/features/products/components/ProductFilterForm";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import { PRODUCT_COPY } from "@/features/products/config/copy";
import { getProducts } from "@/features/products/queries/get-products";
import {
  PRODUCT_SEARCH_PARAMS,
  parseProductSearchParams,
} from "@/features/products/schemas/filters";

type SearchParams = Record<string, string | string[] | undefined>;

type CategoryDetailProps = {
  slug: string;
  searchParams: Promise<SearchParams>;
};

export async function CategoryDetail({ slug, searchParams }: CategoryDetailProps) {
  const filters = parseProductSearchParams({
    ...(await searchParams),
    [PRODUCT_SEARCH_PARAMS.category]: slug,
  });
  const [category, result] = await Promise.all([getCategoryBySlug(slug), getProducts(filters)]);

  if (!category) {
    return (
      <Section spacing="tight">
        <Container>
          <EmptyState
            title={CATEGORY_COPY.notFoundTitle}
            description={CATEGORY_COPY.notFoundDescription}
            action={
              <LinkButton href={ROUTES.categories}>{CATEGORY_COPY.browseCategories}</LinkButton>
            }
          />
        </Container>
      </Section>
    );
  }

  const categoryPath = ROUTES.category(slug);

  return (
    <>
      <CategoryHero category={category} />
      <Section spacing="tight">
        <Container className="space-y-10">
          <p className="text-surface-500 text-xs font-black tracking-[0.14em] uppercase">
            {PRODUCT_COPY.catalogCount(result.total)}
          </p>
          <ProductFilterForm
            categories={[]}
            filters={filters}
            action={categoryPath}
            fixedCategorySlug={slug}
          />
          <ProductGrid items={result.items} />
          <ProductPagination
            filters={filters}
            pageCount={result.pageCount}
            basePath={categoryPath}
          />
        </Container>
      </Section>
    </>
  );
}
