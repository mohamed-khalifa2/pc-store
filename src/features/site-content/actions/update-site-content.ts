"use server";

import { z } from "zod";

import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
  type AdminFieldErrors,
} from "@/features/admin/lib/action-result";
import { formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { siteContentEntrySchema } from "@/features/site-content/schemas/site-content";

const ALLOWED_KEYS = new Set<string>(Object.values(SITE_CONTENT_KEYS));
const SAVE_ERROR = "Content could not be saved.";

const keysSchema = z.array(z.string().min(1)).min(1).max(50);
const entrySchema = siteContentEntrySchema.extend({
  key: z.string().refine((key) => ALLOWED_KEYS.has(key), "Unknown content key."),
  value: z.string(),
});

export async function updateSiteContent(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  let rawKeys: unknown;
  try {
    rawKeys = JSON.parse(formString(formData, "contentKeys"));
  } catch {
    return adminFailure("Invalid content fields.");
  }

  const keys = keysSchema.safeParse(rawKeys);
  if (!keys.success) return adminValidation(keys.error, "Invalid content fields.");

  const entries = keys.data.map((key) => ({ key, value: formString(formData, `value.${key}`) }));
  const parsed = z.array(entrySchema).min(1).safeParse(entries);
  if (!parsed.success) {
    const fieldErrors: AdminFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const index = typeof issue.path[0] === "number" ? issue.path[0] : -1;
      const field = index >= 0 ? (entries[index]?.key ?? "form") : "form";
      fieldErrors[field] = [...(fieldErrors[field] ?? []), issue.message];
    }
    return adminFailure("Check the highlighted fields.", fieldErrors);
  }

  const publishedAt = new Date().toISOString();
  const rows = parsed.data.map((entry) => ({
    key: entry.key,
    value: entry.value,
    is_published: true,
    published_at: publishedAt,
  }));

  const supabase = createAdminClient();
  const { error } = await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  if (error) return adminFailure(SAVE_ERROR);

  revalidatePublic([CACHE_TAGS.siteContent]);
  return adminSuccess<null>("Content saved.");
}
