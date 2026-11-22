import type { SiteContentKey } from "@/features/site-content/config/keys";

export type SiteContentValue = string | number | boolean;

export type SiteContent = Record<SiteContentKey, SiteContentValue>;
