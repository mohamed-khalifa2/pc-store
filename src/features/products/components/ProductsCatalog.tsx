import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { getCategories } from "@/features/categories/queries/get-categories";
import { PRODUCT_COPY } from "@/features/products/config/copy";
import { ProductFilterForm } from "@/features/products/components/ProductFilterForm";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import { getProducts } from "@/features/products/queries/get-products";
import { parseProductSearchParams } from "@/features/products/schemas/filters";

type SearchParams = Record<string, string | string[] | undefined>;

type ProductsCatalogProps = {
  searchParams: Promise<SearchParams>;
};

export async function ProductsCatalog({ searchParams }: ProductsCatalogProps) {
  const filters = parseProductSearchParams(await searchParams);
  const [categories, result] = await Promise.all([getCategories(), getProducts(filters)]);

  return (
    <Section spacing="tight">
      <Container className="space-y-10">
        <header className="space-y-3">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
            {PRODUCT_COPY.catalogEyebrow}
          </p>
          <Heading level={1}>{PRODUCT_COPY.catalogTitle}</Heading>
          <p className="text-surface-400 max-w-2xl">{PRODUCT_COPY.catalogDescription}</p>
          <p className="text-surface-500 text-xs font-black tracking-[0.14em] uppercase">
            {PRODUCT_COPY.catalogCount(result.total)}
          </p>
        </header>

        <ProductFilterForm categories={categories} filters={filters} />
        <ProductGrid items={result.items} />
        <ProductPagination filters={filters} pageCount={result.pageCount} />
      </Container>
    </Section>
  );
}
