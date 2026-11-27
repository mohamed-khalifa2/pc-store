import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingRelationError } from "@/lib/supabase/query-errors";

import { defaultAdminHomeSections } from "@/features/home/lib/default-admin-sections";
import {
  homeSectionConfigSchema,
  homeSectionRowSchema,
} from "@/features/home/schemas/home-section";
import type { AdminHomeSection } from "@/features/site-content/types.admin";

const LOAD_ERROR = "Home sections could not be loaded.";

const adminHomeSectionRowSchema = homeSectionRowSchema.extend({
  is_published: z.boolean(),
  published_at: z.string().nullable(),
});

type AdminHomeSectionRow = z.infer<typeof adminHomeSectionRowSchema>;

function toAdminSection(row: AdminHomeSectionRow): AdminHomeSection {
  const parsedConfig = homeSectionConfigSchema.safeParse(row.config);
  return {
    id: row.id,
    key: row.key,
    kind: row.kind,
    title: row.title,
    subtitle: row.subtitle,
    body: row.body,
    config: parsedConfig.success ? parsedConfig.data : {},
    sortOrder: row.sort_order,
    isPublished: row.is_published,
    publishedAt: row.published_at,
  };
}

export async function getAdminHomeSections(): Promise<AdminHomeSection[]> {
  await requireAdmin();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("home_sections")
    .select("id, key, kind, title, subtitle, body, config, sort_order, is_published, published_at")
    .order("sort_order", { ascending: true });

  if (isMissingRelationError(error)) return defaultAdminHomeSections();
  if (error) throw new Error(LOAD_ERROR);

  const parsed = z.array(adminHomeSectionRowSchema).safeParse(data ?? []);
  if (!parsed.success) throw new Error(LOAD_ERROR);

  return parsed.data.map(toAdminSection);
}
