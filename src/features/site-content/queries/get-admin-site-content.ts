import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { siteContentEntrySchema } from "@/features/site-content/schemas/site-content";
import type { AdminSiteContentEntry } from "@/features/site-content/types.admin";

const LOAD_ERROR = "Site content could not be loaded.";
const ALLOWED_KEYS = new Set<string>(Object.values(SITE_CONTENT_KEYS));

const adminSiteContentRowSchema = siteContentEntrySchema.extend({
  id: z.string().min(1),
  is_published: z.boolean(),
  published_at: z.string().nullable(),
});

export async function getAdminSiteContent(): Promise<AdminSiteContentEntry[]> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("id, key, value, is_published, published_at")
    .order("key", { ascending: true });

  if (error) throw new Error(LOAD_ERROR);

  const parsed = z.array(adminSiteContentRowSchema).safeParse(data ?? []);
  if (!parsed.success) throw new Error(LOAD_ERROR);

  return parsed.data
    .filter((row) => ALLOWED_KEYS.has(row.key))
    .map((row) => ({
      id: row.id,
      key: row.key,
      value: row.value,
      isPublished: row.is_published,
      publishedAt: row.published_at,
    }));
}
