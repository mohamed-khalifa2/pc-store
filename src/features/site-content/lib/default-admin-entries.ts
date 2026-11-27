import { DEFAULT_SITE_CONTENT } from "@/features/site-content/config/defaults";
import type { SiteContentKey } from "@/features/site-content/config/keys";
import type { AdminSiteContentEntry } from "@/features/site-content/types.admin";

const DEFAULT_ID_PREFIX = "default";

export function defaultAdminSiteContentEntries(): AdminSiteContentEntry[] {
  return (Object.keys(DEFAULT_SITE_CONTENT) as SiteContentKey[]).map((key) => ({
    id: `${DEFAULT_ID_PREFIX}-${key}`,
    key,
    value: DEFAULT_SITE_CONTENT[key],
    isPublished: true,
    publishedAt: null,
  }));
}
