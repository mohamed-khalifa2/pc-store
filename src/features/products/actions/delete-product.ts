"use server";

import { z } from "zod";

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
import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ADMIN_PRODUCT_FIELDS,
  adminProductImageRowSchema,
} from "@/features/products/schemas/admin-product";

const deleteSchema = z.object({
  id: z.string().trim().min(1).max(100),
});

export async function deleteProduct(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = deleteSchema.safeParse({ id: formString(formData, ADMIN_PRODUCT_FIELDS.id) });
  if (!parsed.success) return adminValidation(parsed.error);

  const client = createAdminClient();
  const { data: imageData, error: imageError } = await client
    .from("product_images")
    .select("*")
    .eq("product_id", parsed.data.id);
  if (imageError) return adminFailure("The product images could not be checked.");

  const images = z.array(adminProductImageRowSchema).safeParse(imageData ?? []);
  if (!images.success) return adminFailure("The product images could not be checked.");

  const { error: deleteError } = await client.from("products").delete().eq("id", parsed.data.id);
  if (deleteError) return adminFailure("The product could not be deleted.");

  await removeImages(
    client,
    STORAGE_BUCKETS.productImages,
    images.data.map((image) => image.storage_path),
  ).catch(() => undefined);

  revalidatePublic([CACHE_TAGS.products]);

  return adminSuccess("Product deleted.");
}
