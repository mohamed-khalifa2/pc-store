"use server";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { removeImages } from "@/features/admin/lib/storage";
import {
  CATEGORY_FORM_FIELDS,
  categoryDeleteSchema,
} from "@/features/categories/schemas/admin-category";
import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export async function deleteCategory(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = categoryDeleteSchema.safeParse({
    id: formString(formData, CATEGORY_FORM_FIELDS.id),
  });
  if (!parsed.success) return adminValidation(parsed.error, "That category could not be found.");

  const client = createAdminClient();
  const { data, error: loadError } = await client
    .from("categories")
    .select("image_path")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (loadError) return adminFailure("The category could not be deleted.");
  if (!data) return adminFailure("That category no longer exists.");

  const { error: unlinkError } = await client
    .from("categories")
    .update({ parent_id: null })
    .eq("parent_id", parsed.data.id);
  if (unlinkError) return adminFailure("Child categories could not be unlinked.");

  const { error } = await client.from("categories").delete().eq("id", parsed.data.id);
  if (error) return adminFailure("The category could not be deleted.");

  await removeImages(
    client,
    STORAGE_BUCKETS.siteAssets,
    data.image_path ? [data.image_path] : [],
  ).catch(() => undefined);

  revalidatePublic([CACHE_TAGS.categories]);
  return adminSuccess("Category deleted.");
}
