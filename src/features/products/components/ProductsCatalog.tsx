import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { getCategories } from "@/features/categories/queries/get-categories";
import { CatalogHeader } from "@/features/products/components/CatalogHeader";
import { ProductFilterForm } from "@/features/products/components/ProductFilterForm";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductPagination } from "@/features/products/components/ProductPagination";
import { PRODUCT_COPY } from "@/features/products/config/copy";
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
      <Container className="space-y-8">
        <CatalogHeader
          eyebrow={PRODUCT_COPY.catalogEyebrow}
          title={PRODUCT_COPY.catalogTitle}
          description={PRODUCT_COPY.catalogDescription}
          count={PRODUCT_COPY.catalogCount(result.total)}
        />
        <ProductFilterForm categories={categories} filters={filters} />
        <ProductGrid items={result.items} />
        <ProductPagination filters={filters} pageCount={result.pageCount} />
      </Container>
    </Section>
  );
}
