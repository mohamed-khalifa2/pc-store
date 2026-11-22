import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS, ROUTES, STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";
import { safeHref } from "@/lib/format/safe-href";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_BANNERS } from "@/features/banners/config/defaults";
import { BANNER_PLACEMENTS } from "@/features/banners/config/placements";
import { BANNER_VARIANTS } from "@/features/banners/config/variants";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import type { Banner } from "@/features/banners/types";

export async function getActiveBanners(
  placement: string = BANNER_PLACEMENTS.home,
): Promise<Banner[]> {
  "use cache";
  cacheTag(CACHE_TAGS.banners);
  cacheLife("hours");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("banners").select("*").eq("is_active", true);

    if (error) return [...DEFAULT_BANNERS];

    const parsed = z.array(bannerRowSchema).safeParse(data ?? []);
    const rows = parsed.success ? parsed.data.filter((row) => row.placement === placement) : [];
    if (rows.length === 0) return [...DEFAULT_BANNERS];

    return rows.map((row, index) => {
      const fallback = DEFAULT_BANNERS[index % DEFAULT_BANNERS.length]!;
      return {
        id: row.id,
        name: row.name,
        headline: row.headline ?? row.name,
        subheadline: row.subheadline,
        ctaLabel: row.cta_label,
        ctaHref: safeHref(row.cta_href, ROUTES.products),
        imageUrl: resolveAssetUrl(row.image_path, STORAGE_BUCKETS.banners, fallback.imageUrl),
        mobileImageUrl: resolveAssetUrl(
          row.mobile_image_path ?? row.image_path,
          STORAGE_BUCKETS.banners,
          fallback.mobileImageUrl,
        ),
        variant: BANNER_VARIANTS[index % BANNER_VARIANTS.length]!,
      };
    });
  } catch {
    return [...DEFAULT_BANNERS];
  }
}
