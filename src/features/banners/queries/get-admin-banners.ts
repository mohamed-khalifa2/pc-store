import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import type { AdminBanner } from "@/features/banners/types.admin";
import { createAdminClient } from "@/lib/supabase/admin";

type BannerRow = z.infer<typeof bannerRowSchema>;

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

    if (error) return [];

    const parsed = z.array(bannerRowSchema).safeParse(data ?? []);
    return parsed.success ? parsed.data.map(toAdminBanner) : [];
  } catch {
    return [];
  }
}
