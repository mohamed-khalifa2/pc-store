import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_CATEGORIES } from "@/features/categories/config/defaults";
import {
  categoryDetailRowSchema,
  categorySlugSchema,
} from "@/features/categories/schemas/category-detail";
import type { CategoryCardData, CategoryDetailData } from "@/features/categories/types";

const CATEGORY_COLUMNS = "id, name, slug, description, image_path, parent_id, sort_order";

export async function getCategoryBySlug(slug: string): Promise<CategoryDetailData | null> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife("hours");

  const parsedSlug = categorySlugSchema.safeParse(slug);
  const fallback = parsedSlug.success
    ? toCategoryDetail(DEFAULT_CATEGORIES.find((category) => category.slug === parsedSlug.data))
    : null;

  if (!parsedSlug.success) return null;

  try {
    const client = createPublicClient();
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .eq("slug", parsedSlug.data)
      .maybeSingle();

    if (error || !data) return fallback;

    const parsed = categoryDetailRowSchema.safeParse(data);
    if (!parsed.success) return fallback;

    const row = parsed.data;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: resolveAssetUrl(
        row.image_path,
        STORAGE_BUCKETS.siteAssets,
        fallback?.imageUrl ?? DEFAULT_CATEGORIES[0].imageUrl,
      ),
      parentId: row.parent_id,
      sortOrder: row.sort_order,
    };
  } catch {
    return fallback;
  }
}

function toCategoryDetail(category: CategoryCardData | undefined): CategoryDetailData | null {
  if (!category) return null;

  return {
    ...category,
    parentId: null,
    sortOrder: DEFAULT_CATEGORIES.findIndex((item) => item.id === category.id) * 10,
  };
}
