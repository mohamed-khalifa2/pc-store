import type { SiteContentKey } from "@/features/site-content/config/keys";

export type SiteContentValue = string | number | boolean;

export type SiteContent = Record<SiteContentKey, SiteContentValue>;

export type SiteContentEntry = {
  key: string;
  value: SiteContentValue;
};
