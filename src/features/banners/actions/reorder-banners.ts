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
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

const orderedIdsSchema = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}, z.array(z.uuid()).min(1));

const reorderSchema = z.object({ orderedIds: orderedIdsSchema });

export async function reorderBanners(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = reorderSchema.safeParse({ orderedIds: formString(formData, "orderedIds") });
  if (!parsed.success) return adminValidation(parsed.error);

  const client = createAdminClient();

  try {
    const results = await Promise.all(
      parsed.data.orderedIds.map((id, index) => {
        const payload: Database["public"]["Tables"]["banners"]["Update"] = {
          sort_order: index,
        };
        return client.from("banners").update(payload).eq("id", id);
      }),
    );

    if (results.some((result) => result.error)) {
      return adminFailure("The banner order could not be saved.");
    }

    refreshAndRevalidate(CACHE_TAGS.banners, [CACHE_TAGS.banners]);
    return adminSuccess("Banner order saved.");
  } catch {
    return adminFailure(ADMIN_COPY.unexpectedError);
  }
}
