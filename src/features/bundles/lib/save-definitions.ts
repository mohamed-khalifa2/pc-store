import "server-only";

import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import type { BundleDefinition } from "@/features/bundles/config/bundles";
import { bundleDefinitionsSchema } from "@/features/bundles/schemas/bundle";
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";

const SAVE_ERROR = "Bundles could not be saved.";

export async function saveBundleDefinitions(
  definitions: readonly BundleDefinition[],
): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = bundleDefinitionsSchema.safeParse(definitions);
  if (!parsed.success) return adminValidation(parsed.error, "Bundle list is invalid.");

  const { error } = await createAdminClient()
    .from("site_content")
    .upsert(
      {
        key: SITE_CONTENT_KEYS.bundlesDefinitions,
        value: JSON.stringify(parsed.data),
        is_published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: "key" },
    );

  if (error) return adminFailure(SAVE_ERROR);

  revalidatePublic([CACHE_TAGS.siteContent]);
  return adminSuccess<null>("Bundles saved.");
}
