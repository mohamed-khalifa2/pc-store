import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_PRODUCTS } from "@/features/products/config/defaults";
import { productRowSchema } from "@/features/products/schemas/product";
import type { ProductCardData } from "@/features/products/types";

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const safeLimit = z.number().int().min(1).max(12).catch(8).parse(limit);

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, slug, description, price_egp, compare_at_price, stock")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .limit(safeLimit);

    if (error) return DEFAULT_PRODUCTS.slice(0, safeLimit).map((item) => ({ ...item }));

    const parsed = z.array(productRowSchema).safeParse(data ?? []);
    if (!parsed.success || parsed.data.length === 0) {
      return DEFAULT_PRODUCTS.slice(0, safeLimit).map((item) => ({ ...item }));
    }

    return parsed.data.map((row, index) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      priceEgp: row.price_egp,
      compareAtPrice: row.compare_at_price,
      stock: row.stock,
      imageUrl: DEFAULT_PRODUCTS[index % DEFAULT_PRODUCTS.length].imageUrl,
    }));
  } catch {
    return DEFAULT_PRODUCTS.slice(0, safeLimit).map((item) => ({ ...item }));
  }
}
