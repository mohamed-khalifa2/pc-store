"use server";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formBoolean, formNumber, formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { removeImages } from "@/features/admin/lib/storage";
import {
  CATEGORY_FORM_FIELDS,
  categoryUpsertSchema,
} from "@/features/categories/schemas/admin-category";
import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export async function upsertCategory(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = categoryUpsertSchema.safeParse({
    [CATEGORY_FORM_FIELDS.id]: formString(formData, CATEGORY_FORM_FIELDS.id),
    [CATEGORY_FORM_FIELDS.name]: formString(formData, CATEGORY_FORM_FIELDS.name),
    [CATEGORY_FORM_FIELDS.slug]: formString(formData, CATEGORY_FORM_FIELDS.slug),
    [CATEGORY_FORM_FIELDS.description]: formString(formData, CATEGORY_FORM_FIELDS.description),
    [CATEGORY_FORM_FIELDS.parentId]: formString(formData, CATEGORY_FORM_FIELDS.parentId),
    [CATEGORY_FORM_FIELDS.imagePath]: formString(formData, CATEGORY_FORM_FIELDS.imagePath),
    [CATEGORY_FORM_FIELDS.sortOrder]: formNumber(formData, CATEGORY_FORM_FIELDS.sortOrder),
    [CATEGORY_FORM_FIELDS.isPublished]: formBoolean(formData, CATEGORY_FORM_FIELDS.isPublished),
    [CATEGORY_FORM_FIELDS.publishedAt]: formString(formData, CATEGORY_FORM_FIELDS.publishedAt),
  });
  if (!parsed.success) return adminValidation(parsed.error);

  const input = parsed.data;
  const payload = {
    name: input.name,
    slug: input.slug,
    description: input.description,
    image_path: input.imagePath,
    parent_id: input.parentId,
    sort_order: input.sortOrder,
    is_published: input.isPublished,
    published_at: input.isPublished ? (input.publishedAt ?? new Date().toISOString()) : null,
  };

  const client = createAdminClient();
  let oldImagePath: string | null = null;

  try {
    if (input.id) {
      const { data: existing, error: loadError } = await client
        .from("categories")
        .select("image_path")
        .eq("id", input.id)
        .maybeSingle();
      if (loadError) return adminFailure("The category could not be loaded.");
      if (!existing) return adminFailure("That category no longer exists.");
      oldImagePath = existing.image_path;
    }

    const result = input.id
      ? await client
          .from("categories")
          .update(payload)
          .eq("id", input.id)
          .select("id")
          .maybeSingle()
      : await client.from("categories").insert(payload).select("id").maybeSingle();

    if (result.error) return adminFailure("The category could not be saved.");
  } catch {
    return adminFailure("The category could not be saved.");
  }

  if (oldImagePath && oldImagePath !== input.imagePath) {
    await removeImages(client, STORAGE_BUCKETS.siteAssets, [oldImagePath]).catch(() => undefined);
  }

  revalidatePublic([CACHE_TAGS.categories]);
  return adminSuccess("Category saved.");
}
