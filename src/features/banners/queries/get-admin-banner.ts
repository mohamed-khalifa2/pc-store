import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { toAdminBanner } from "@/features/banners/queries/get-admin-banners";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import type { AdminBanner } from "@/features/banners/types.admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getAdminBanner(id: string): Promise<AdminBanner | null> {
  await requireAdmin();

  if (!z.uuid().safeParse(id).success) return null;

  try {
    const client = createAdminClient();
    const { data, error } = await client.from("banners").select("*").eq("id", id).maybeSingle();

    if (error || !data) return null;

    const parsed = bannerRowSchema.safeParse(data);
    return parsed.success ? toAdminBanner(parsed.data) : null;
  } catch {
    return null;
  }
}
