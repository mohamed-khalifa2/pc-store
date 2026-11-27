import "server-only";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import {
  DEFAULT_BUNDLE_DEFINITIONS,
  type BundleDefinition,
} from "@/features/bundles/config/bundles";
import { parseBundleDefinitions } from "@/features/bundles/lib/parse-definitions";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getAdminSiteContent } from "@/features/site-content/queries/get-admin-site-content";

export async function getAdminBundles(): Promise<BundleDefinition[]> {
  await requireAdmin();

  const entries = await getAdminSiteContent();
  const value = entries.find((entry) => entry.key === SITE_CONTENT_KEYS.bundlesDefinitions)?.value;

  return value === undefined ? [...DEFAULT_BUNDLE_DEFINITIONS] : parseBundleDefinitions(value);
}
