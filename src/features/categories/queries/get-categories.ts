import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_CATEGORIES } from "@/features/categories/config/defaults";
import { categoryRowSchema } from "@/features/categories/schemas/category";
import type { CategoryCardData } from "@/features/categories/types";

const CATEGORY_COLUMNS = "id, name, slug, description, image_path";

export async function getCategories(): Promise<CategoryCardData[]> {
  "use cache";
  cacheTag(CACHE_TAGS.categories);
  cacheLife("hours");

  const defaults = DEFAULT_CATEGORIES.map((category) => ({ ...category }));

  try {
    const client = createPublicClient();
    const { data, error } = await client
      .from("categories")
      .select(CATEGORY_COLUMNS)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) return defaults;

    const parsed = z.array(categoryRowSchema).safeParse(data ?? []);
    if (!parsed.success || parsed.data.length === 0) return defaults;

    return parsed.data.map((row, index) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      imageUrl: resolveAssetUrl(
        row.image_path,
        STORAGE_BUCKETS.siteAssets,
        defaults[index % defaults.length].imageUrl,
      ),
    }));
  } catch {
    return defaults;
  }
}
