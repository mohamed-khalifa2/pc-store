import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_CATEGORIES } from "@/features/categories/config/defaults";
import { categoryRowSchema } from "@/features/categories/schemas/category";
import type { CategoryCardData } from "@/features/categories/types";

export async function getFeaturedCategories(limit = 6): Promise<CategoryCardData[]> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife("hours");

  const safeLimit = z.number().int().min(1).max(12).catch(6).parse(limit);

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_path")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .limit(safeLimit);

    if (error) return DEFAULT_CATEGORIES.slice(0, safeLimit).map((item) => ({ ...item }));

    const parsed = z.array(categoryRowSchema).safeParse(data ?? []);
    if (!parsed.success || parsed.data.length === 0) {
      return DEFAULT_CATEGORIES.slice(0, safeLimit).map((item) => ({ ...item }));
    }

    return parsed.data.map((row, index) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: resolveAssetUrl(
        row.image_path,
        STORAGE_BUCKETS.siteAssets,
        DEFAULT_CATEGORIES[index % DEFAULT_CATEGORIES.length].imageUrl,
      ),
    }));
  } catch {
    return DEFAULT_CATEGORIES.slice(0, safeLimit).map((item) => ({ ...item }));
  }
}
