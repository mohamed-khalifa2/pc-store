import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import type { AdminBanner } from "@/features/banners/types.admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingRelationError } from "@/lib/supabase/query-errors";

type BannerRow = z.infer<typeof bannerRowSchema>;
const LOAD_ERROR = "Banners could not be loaded.";

export function toAdminBanner(row: BannerRow): AdminBanner {
  return {
    id: row.id,
    name: row.name,
    imagePath: row.image_path,
    mobileImagePath: row.mobile_image_path,
    placement: row.placement,
    headline: row.headline,
    subheadline: row.subheadline,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    publishedAt: row.published_at,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
  };
}

export async function getAdminBanners(): Promise<AdminBanner[]> {
  await requireAdmin();

  try {
    const client = createAdminClient();
    const { data, error } = await client
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (isMissingRelationError(error)) return [];
    if (error) throw new Error(LOAD_ERROR);

    const parsed = z.array(bannerRowSchema).safeParse(data ?? []);
    if (!parsed.success) throw new Error(LOAD_ERROR);
    return parsed.data.map(toAdminBanner);
  } catch (caught) {
    if (caught instanceof Error) throw caught;
    throw new Error(LOAD_ERROR);
  }
}
