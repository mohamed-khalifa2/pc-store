import type { Metadata } from "next";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import { getProductBySlug } from "@/features/products/queries/get-product-by-slug";

export async function buildProductMetadata(slug: string): Promise<Metadata> {
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: PRODUCT_COPY.productNotFound,
      robots: { index: false, follow: false },
    };
  }

  const description = product.description ?? PRODUCT_COPY.catalogDescription;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: [{ url: product.imageUrl }],
    },
  };
}
