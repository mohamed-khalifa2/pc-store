import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_SITE_CONTENT } from "@/features/site-content/config/defaults";
import { SITE_CONTENT_KEYS, type SiteContentKey } from "@/features/site-content/config/keys";
import { siteContentEntrySchema } from "@/features/site-content/schemas/site-content";
import type { SiteContent } from "@/features/site-content/types";

export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CACHE_TAGS.siteContent);
  cacheLife("hours");

  const allowedKeys = new Set<string>(Object.values(SITE_CONTENT_KEYS));
  const result: SiteContent = { ...DEFAULT_SITE_CONTENT };

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("key, value")
      .eq("is_published", true);

    if (error) return result;

    const parsed = z.array(siteContentEntrySchema).safeParse(data ?? []);
    if (!parsed.success) return result;

    for (const entry of parsed.data) {
      if (allowedKeys.has(entry.key)) {
        result[entry.key as SiteContentKey] = entry.value;
      }
    }

    return result;
  } catch {
    return result;
  }
}
