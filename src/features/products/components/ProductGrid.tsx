import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { ROUTES } from "@/lib/constants";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import { ProductCard } from "@/features/products/components/ProductCard";
import type { ProductCardData } from "@/features/products/types";

type ProductGridProps = {
  items: ProductCardData[];
};

export function ProductGrid({ items }: ProductGridProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={PRODUCT_COPY.noProductsTitle}
        description={PRODUCT_COPY.noProductsDescription}
        action={<LinkButton href={ROUTES.products}>{PRODUCT_COPY.browseProducts}</LinkButton>}
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
