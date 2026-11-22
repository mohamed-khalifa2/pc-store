import type { Metadata } from "next";
import { Suspense } from "react";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import { ProductsCatalog } from "@/features/products/components/ProductsCatalog";
import { ProductsSkeleton } from "@/features/products/components/ProductsSkeleton";

export const metadata: Metadata = {
  title: PRODUCT_COPY.catalogTitle,
  description: PRODUCT_COPY.catalogDescription,
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsCatalog searchParams={searchParams} />
    </Suspense>
  );
}
