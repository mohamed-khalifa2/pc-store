import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getRelatedProducts } from "@/features/products/queries/get-related-products";

type RelatedProductsProps = {
  categorySlug: string | null;
  excludeId: string;
};

export async function RelatedProducts({ categorySlug, excludeId }: RelatedProductsProps) {
  const products = await getRelatedProducts(categorySlug, excludeId);

  if (products.length === 0) return null;

  return (
    <Section spacing="tight" className="border-surface-800 border-t">
      <Container className="space-y-10">
        <div className="space-y-3">
          <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
            {PRODUCT_COPY.relatedEyebrow}
          </p>
          <Heading level={2}>{PRODUCT_COPY.relatedTitle}</Heading>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
