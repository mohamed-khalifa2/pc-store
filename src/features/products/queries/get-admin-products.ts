import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { PRODUCTS_PER_PAGE, STORAGE_BUCKETS } from "@/lib/constants";
import { DEFAULT_PRODUCT_IMAGE } from "@/features/products/config/defaults";
import { escapeLikeTerm } from "@/features/products/lib/search-term";
import { resolveAssetUrl } from "@/lib/format/asset-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingRelationError } from "@/lib/supabase/query-errors";
import {
  ADMIN_PUBLISHED_FILTER,
  adminCategoryOptionRowSchema,
  adminProductFiltersSchema,
  adminProductImageRowSchema,
  adminProductRowSchema,
  type AdminProductFilters,
} from "@/features/products/schemas/admin-product";

export type AdminProductListRow = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  priceEgp: number;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  categoryName: string | null;
  thumbnailUrl: string;
};

export type AdminProductListResult = {
  items: AdminProductListRow[];
  total: number;
  page: number;
  pageCount: number;
};

const LOAD_ERROR = "Products could not be loaded.";

function loadFailed(): never {
  throw new Error(LOAD_ERROR);
}

function emptyResult(page: number): AdminProductListResult {
  return { items: [], total: 0, page, pageCount: 1 };
}

export async function getAdminProducts(
  filters: AdminProductFilters,
): Promise<AdminProductListResult> {
  await requireAdmin();

  const safe = adminProductFiltersSchema.parse(filters);
  const client = createAdminClient();

  try {
    const { data: categoryData, error: categoryError } = await client
      .from("categories")
      .select("*");
    if (isMissingRelationError(categoryError)) return emptyResult(safe.page);
    if (categoryError) loadFailed();

    const categoryRows = z.array(adminCategoryOptionRowSchema).safeParse(categoryData ?? []);
    if (!categoryRows.success) loadFailed();
    const categories = categoryRows.data;

    const category = safe.category
      ? categories.find((item) => item.slug === safe.category)
      : undefined;
    if (safe.category && !category) return emptyResult(safe.page);

    let query = client.from("products").select("*", { count: "exact" });
    if (safe.published !== ADMIN_PUBLISHED_FILTER.all) {
      query = query.eq("is_published", safe.published === ADMIN_PUBLISHED_FILTER.true);
    }
    if (category) query = query.eq("category_id", category.id);

    const term = escapeLikeTerm(safe.q);
    if (term) query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);

    const from = (safe.page - 1) * PRODUCTS_PER_PAGE;
    const { data, error, count } = await query
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(from, from + PRODUCTS_PER_PAGE - 1);
    if (isMissingRelationError(error)) return emptyResult(safe.page);
    if (error) loadFailed();

    const rows = z.array(adminProductRowSchema).safeParse(data ?? []);
    if (!rows.success) loadFailed();

    const thumbnails: Record<string, string> = {};
    const ids = rows.data.map((row) => row.id);
    if (ids.length > 0) {
      const { data: imageData, error: imageError } = await client
        .from("product_images")
        .select("*")
        .in("product_id", ids)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (imageError && !isMissingRelationError(imageError)) loadFailed();

      const images = z.array(adminProductImageRowSchema).safeParse(imageData ?? []);
      if (images.success) {
        for (const image of images.data) {
          if (!thumbnails[image.product_id]) {
            thumbnails[image.product_id] = resolveAssetUrl(
              image.storage_path,
              STORAGE_BUCKETS.productImages,
              DEFAULT_PRODUCT_IMAGE,
            );
          }
        }
      }
    }

    const categoryNames = new Map(categories.map((item) => [item.id, item.name]));
    const total = count ?? rows.data.length;

    return {
      items: rows.data.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        sku: row.sku,
        priceEgp: row.price_egp,
        stock: row.stock,
        isPublished: row.is_published,
        isFeatured: row.is_featured,
        categoryName: row.category_id ? (categoryNames.get(row.category_id) ?? null) : null,
        thumbnailUrl: thumbnails[row.id] ?? DEFAULT_PRODUCT_IMAGE,
      })),
      total,
      page: safe.page,
      pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
    };
  } catch (caught) {
    if (caught instanceof Error) throw caught;
    throw new Error(LOAD_ERROR);
  }
}
