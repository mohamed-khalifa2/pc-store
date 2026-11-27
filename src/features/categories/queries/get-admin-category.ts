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

export async function getAdminCategory(rawId: string): Promise<AdminCategory | null> {
  await requireAdmin();

  const id = z.uuid().safeParse(rawId);
  if (!id.success) return null;

  const client = createAdminClient();
  const { data, error } = await client
    .from("categories")
    .select(CATEGORY_COLUMNS)
    .eq("id", id.data)
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw new Error(ADMIN_COPY.loadError);
  if (!data) return null;

  const parsed = adminCategoryRowSchema.safeParse(data);
  if (!parsed.success) throw new Error(ADMIN_COPY.loadError);

  const row = parsed.data;
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
