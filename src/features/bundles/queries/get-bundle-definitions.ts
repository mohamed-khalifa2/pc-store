import {
  DEFAULT_BUNDLE_DEFINITIONS,
  type BundleDefinition,
} from "@/features/bundles/config/bundles";
import { parseBundleDefinitions } from "@/features/bundles/lib/parse-definitions";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteContent } from "@/features/site-content/queries/get-site-content";

export async function getBundleDefinitions(): Promise<BundleDefinition[]> {
  const content = await getSiteContent();
  const value = content[SITE_CONTENT_KEYS.bundlesDefinitions];
  return value === undefined ? [...DEFAULT_BUNDLE_DEFINITIONS] : parseBundleDefinitions(value);
}
