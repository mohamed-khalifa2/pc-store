import type { Metadata } from "next";
import { Suspense } from "react";

import { ProductDetail } from "@/features/products/components/ProductDetail";
import { ProductDetailSkeleton } from "@/features/products/components/ProductDetailSkeleton";
import { DEFAULT_PRODUCT_SLUGS } from "@/features/products/config/detail-defaults";
import { buildProductMetadata } from "@/features/products/lib/product-metadata";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return DEFAULT_PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildProductMetadata(slug);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetail slug={slug} />
    </Suspense>
  );
}
