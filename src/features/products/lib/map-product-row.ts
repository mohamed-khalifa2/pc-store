import type { z } from "zod";

import type { productRowSchema } from "@/features/products/schemas/product";
import type { ProductCardData, ProductDetailData } from "@/features/products/types";

type ProductRow = z.infer<typeof productRowSchema>;

export function toProductCard(row: ProductRow, imageUrl: string): ProductCardData {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    priceEgp: row.price_egp,
    compareAtPrice: row.compare_at_price,
    stock: row.stock,
    imageUrl,
  };
}

export function toDefaultCard(detail: ProductDetailData): ProductCardData {
  return {
    id: detail.id,
    name: detail.name,
    slug: detail.slug,
    description: detail.description,
    priceEgp: detail.priceEgp,
    compareAtPrice: detail.compareAtPrice,
    stock: detail.stock,
    imageUrl: detail.imageUrl,
  };
}
