import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/server";

import { findCategoryRefById } from "@/features/categories/queries/find-category-ref-by-id";
import { DEFAULT_PRODUCT_IMAGE } from "@/features/products/config/defaults";
import { DEFAULT_PRODUCT_DETAILS } from "@/features/products/config/detail-defaults";
import { toProductCard } from "@/features/products/lib/map-product-row";
import { detailProductRowSchema } from "@/features/products/schemas/listing";
import { parseProductSpecs } from "@/features/products/schemas/product";
import type { ProductDetailData, ProductImageData } from "@/features/products/types";
import { loadProductImages } from "@/features/products/queries/load-product-images";

const PRODUCT_COLUMNS =
  "id, name, slug, description, price_egp, compare_at_price, stock, sku, specs, category_id";

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9_-]+$/)
  .min(1)
  .max(200);

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const parsedSlug = slugSchema.safeParse(slug);
  const fallback = parsedSlug.success
    ? (DEFAULT_PRODUCT_DETAILS.find((item) => item.slug === parsedSlug.data) ?? null)
    : null;

  if (!parsedSlug.success) return null;

  try {
    const client = createPublicClient();
    const { data, error } = await client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("slug", parsedSlug.data)
      .maybeSingle();

    if (error || !data) return fallback;

    const parsed = detailProductRowSchema.safeParse(data);
    if (!parsed.success) return fallback;

    const row = parsed.data;
    const category = await findCategoryRefById(client, row.category_id);
    if (!category.available) return fallback;

    const loaded = await loadProductImages(client, [row.id], row.name);
    const images: ProductImageData[] = loaded[row.id]?.length
      ? loaded[row.id]
      : [{ url: DEFAULT_PRODUCT_IMAGE, alt: row.name }];

    return {
      ...toProductCard(row, images[0].url),
      sku: row.sku,
      category: category.ref,
      specs: parseProductSpecs(row.specs),
      images,
    };
  } catch {
    return fallback;
  }
}
