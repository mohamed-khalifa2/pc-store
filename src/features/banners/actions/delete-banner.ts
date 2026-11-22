"use server";

import { z } from "zod";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formString } from "@/features/admin/lib/form-data";
import { refreshAndRevalidate } from "@/features/admin/lib/revalidate-public";
import { removeImages } from "@/features/admin/lib/storage";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

const deleteSchema = z.object({ id: z.uuid() });

export async function deleteBanner(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = deleteSchema.safeParse({ id: formString(formData, "id") });
  if (!parsed.success) return adminValidation(parsed.error);

  const client = createAdminClient();

  try {
    const { data, error } = await client
      .from("banners")
      .select("*")
      .eq("id", parsed.data.id)
      .maybeSingle();

    if (error) return adminFailure("The banner could not be loaded.");
    const row = data ? bannerRowSchema.safeParse(data) : null;
    if (!row?.success) return adminFailure(ADMIN_COPY.invalidId);

    const { error: deleteError } = await client.from("banners").delete().eq("id", parsed.data.id);
    if (deleteError) return adminFailure("The banner could not be deleted.");

    const paths = [row.data.image_path, row.data.mobile_image_path].filter((path): path is string =>
      Boolean(path),
    );
    await removeImages(client, STORAGE_BUCKETS.banners, paths).catch(() => undefined);

    refreshAndRevalidate(CACHE_TAGS.banners, [CACHE_TAGS.banners]);
    return adminSuccess("Banner deleted.");
  } catch {
    return adminFailure(ADMIN_COPY.unexpectedError);
  }
}
