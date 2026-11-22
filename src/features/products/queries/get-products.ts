import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS, PRODUCTS_PER_PAGE } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/server";

import { findCategoryId } from "@/features/categories/queries/find-category-id";
import { filterDefaultProducts } from "@/features/products/lib/filter-defaults";
import { toProductCard } from "@/features/products/lib/map-product-row";
import { escapeLikeTerm } from "@/features/products/lib/search-term";
import {
  PRODUCT_SORT,
  productFiltersSchema,
  type ProductFilters,
  type ProductSort,
} from "@/features/products/schemas/filters";
import { listedProductRowSchema } from "@/features/products/schemas/listing";
import type { ProductListResult } from "@/features/products/types";
import { firstImageUrl, loadProductImages } from "@/features/products/queries/load-product-images";

const PRODUCT_COLUMNS =
  "id, name, slug, description, price_egp, compare_at_price, stock, category_id, sort_order, created_at";

type OrderColumn = "created_at" | "price_egp" | "name";

function orderColumnFor(sort: ProductSort): OrderColumn {
  if (sort === PRODUCT_SORT.priceAsc || sort === PRODUCT_SORT.priceDesc) return "price_egp";
  if (sort === PRODUCT_SORT.nameAsc) return "name";
  return "created_at";
}

function emptyResult(page: number): ProductListResult {
  return { items: [], total: 0, page, pageCount: 1 };
}

export async function getProducts(filters: ProductFilters): Promise<ProductListResult> {
  "use cache";
  cacheTag(CACHE_TAGS.products);
  cacheLife("hours");

  const safe = productFiltersSchema.parse(filters);
  const client = createPublicClient();

  try {
    let query = client
      .from("products")
      .select(PRODUCT_COLUMNS, { count: "exact" })
      .eq("is_published", true);

    if (safe.categorySlug) {
      const lookup = await findCategoryId(client, safe.categorySlug);
      if (!lookup.available) return filterDefaultProducts(safe);
      if (!lookup.id) return emptyResult(safe.page);
      query = query.eq("category_id", lookup.id);
    }

    if (safe.q) {
      const term = escapeLikeTerm(safe.q);
      if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (safe.min !== null) query = query.gte("price_egp", safe.min);
    if (safe.max !== null) query = query.lte("price_egp", safe.max);
    if (safe.inStock) query = query.gt("stock", 0);

    const ascending = safe.sort === PRODUCT_SORT.nameAsc || safe.sort === PRODUCT_SORT.priceAsc;
    const from = (safe.page - 1) * PRODUCTS_PER_PAGE;
    const { data, error, count } = await query
      .order(orderColumnFor(safe.sort), { ascending })
      .range(from, from + PRODUCTS_PER_PAGE - 1);

    if (error) return filterDefaultProducts(safe);

    const parsed = z.array(listedProductRowSchema).safeParse(data ?? []);
    if (!parsed.success) return filterDefaultProducts(safe);

    const images = await loadProductImages(
      client,
      parsed.data.map((row) => row.id),
    );
    const total = count ?? parsed.data.length;

    return {
      items: parsed.data.map((row) => toProductCard(row, firstImageUrl(images, row.id))),
      total,
      page: safe.page,
      pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
    };
  } catch {
    return filterDefaultProducts(safe);
  }
}
