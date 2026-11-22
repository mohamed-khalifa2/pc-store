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
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

const toggleSchema = z.object({ id: z.uuid() });

export async function toggleBanner(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = toggleSchema.safeParse({ id: formString(formData, "id") });
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

    const nextActive = !row.data.is_active;
    const payload: Database["public"]["Tables"]["banners"]["Update"] = {
      is_active: nextActive,
    };
    const { error: updateError } = await client
      .from("banners")
      .update(payload)
      .eq("id", parsed.data.id);

    if (updateError) return adminFailure("The banner status could not be updated.");

    refreshAndRevalidate(CACHE_TAGS.banners, [CACHE_TAGS.banners]);
    return adminSuccess(nextActive ? "Banner activated." : "Banner paused.");
  } catch {
    return adminFailure(ADMIN_COPY.unexpectedError);
  }
}
