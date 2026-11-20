import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { ROUTES } from "@/lib/constants";

import type { HomeSection } from "@/features/home/types";
import type { ProductCardData } from "@/features/products/types";
import { ProductCard } from "@/features/products/components/ProductCard";

type FeaturedProductsSectionProps = {
  section: HomeSection;
  products: ProductCardData[];
};

export function FeaturedProductsSection({ section, products }: FeaturedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <Section className="border-surface-800 border-b">
      <Container className="space-y-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="space-y-3">
            <Heading level={2}>{section.title ?? "Featured products"}</Heading>
            {section.subtitle && <p className="text-surface-400 text-lg">{section.subtitle}</p>}
          </div>
          <LinkButton href={ROUTES.products} variant="secondary">
            View all
          </LinkButton>
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
