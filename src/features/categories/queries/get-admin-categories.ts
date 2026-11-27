import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { adminCategoryRowSchema } from "@/features/categories/schemas/admin-category";
import type { AdminCategory } from "@/features/categories/types.admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingRelationError } from "@/lib/supabase/query-errors";

const CATEGORY_COLUMNS =
  "id, name, slug, description, image_path, parent_id, sort_order, is_published, published_at";

type CategoryRow = z.infer<typeof adminCategoryRowSchema>;

function toAdminCategory(row: CategoryRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imagePath: row.image_path,
    parentId: row.parent_id,
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    publishedAt: row.published_at,
  };
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await requireAdmin();

  const client = createAdminClient();
  const { data, error } = await client
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (isMissingRelationError(error)) return [];
  if (error) throw new Error(ADMIN_COPY.loadError);

  const parsed = z.array(adminCategoryRowSchema).safeParse(data ?? []);
  if (!parsed.success) throw new Error(ADMIN_COPY.loadError);

  return parsed.data.map(toAdminCategory);
}
