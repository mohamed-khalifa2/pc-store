import type { SiteContentKey } from "@/features/site-content/config/keys";
import type { SiteContent } from "@/features/site-content/types";

export function getSiteText(content: SiteContent, key: SiteContentKey, fallback: string): string {
  const value = content[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}
