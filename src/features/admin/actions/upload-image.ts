"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import {
  adminFailure,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { createAdminClient } from "@/lib/supabase/admin";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { AdminStorageBucket } from "@/features/admin/lib/storage";
import { uploadImage } from "@/features/admin/lib/storage";

const uploadSchema = z.object({
  bucket: z.enum([
    STORAGE_BUCKETS.banners,
    STORAGE_BUCKETS.productImages,
    STORAGE_BUCKETS.siteAssets,
  ]),
  prefix: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-zA-Z0-9/_-]+$/),
});

export async function uploadAdminImage(formData: FormData): Promise<AdminActionResult<string>> {
  await requireAdmin();

  const parsed = uploadSchema.safeParse({
    bucket: formData.get("bucket"),
    prefix: formData.get("prefix"),
  });
  if (!parsed.success) return adminValidation(parsed.error);

  const file = formData.get("file");
  if (!(file instanceof File)) return adminFailure<string>("Choose an image to upload.");

  const client = createAdminClient();
  const result = await uploadImage(
    client,
    parsed.data.bucket as AdminStorageBucket,
    parsed.data.prefix,
    file,
  );

  return result;
}
