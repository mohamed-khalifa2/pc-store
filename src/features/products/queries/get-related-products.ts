import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS, RELATED_PRODUCTS_LIMIT } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/server";

import { findCategoryId } from "@/features/categories/queries/find-category-id";
import { DEFAULT_PRODUCT_DETAILS } from "@/features/products/config/detail-defaults";
import { toDefaultCard, toProductCard } from "@/features/products/lib/map-product-row";
import { listedProductRowSchema } from "@/features/products/schemas/listing";
import type { ProductCardData } from "@/features/products/types";
import { firstImageUrl, loadProductImages } from "@/features/products/queries/load-product-images";

const PRODUCT_COLUMNS =
  "id, name, slug, description, price_egp, compare_at_price, stock, category_id, sort_order, created_at";

const safeSlug = z.string().trim().max(200).nullable().catch(null);
const safeId = z.string().min(1).max(200).catch("");

export async function getRelatedProducts(
  categorySlug: string | null,
  excludeId: string,
): Promise<ProductCardData[]> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const category = safeSlug.parse(categorySlug);
  const excluded = safeId.parse(excludeId);
  const fallback = DEFAULT_PRODUCT_DETAILS.filter(
    (item) => item.id !== excluded && (!category || item.category?.slug === category),
  )
    .slice(0, RELATED_PRODUCTS_LIMIT)
    .map(toDefaultCard);

  try {
    const client = createPublicClient();
    let query = client
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("is_published", true)
      .neq("id", excluded);

    if (category) {
      const lookup = await findCategoryId(client, category);
      if (!lookup.available) return fallback;
      if (!lookup.id) return [];
      query = query.eq("category_id", lookup.id);
    }

    const { data, error } = await query
      .order("sort_order", { ascending: true })
      .limit(RELATED_PRODUCTS_LIMIT);

    if (error) return fallback;

    const parsed = z.array(listedProductRowSchema).safeParse(data ?? []);
    if (!parsed.success) return fallback;

    const images = await loadProductImages(
      client,
      parsed.data.map((row) => row.id),
    );
    return parsed.data.map((row) => toProductCard(row, firstImageUrl(images, row.id)));
  } catch {
    return fallback;
  }
}
