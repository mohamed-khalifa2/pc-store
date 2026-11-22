import type { HomeSectionBody, HomeSectionConfig } from "@/features/home/types";
import type { SiteContentValue } from "@/features/site-content/types";

export type AdminSiteContentEntry = {
  id: string;
  key: string;
  value: SiteContentValue;
  isPublished: boolean;
  publishedAt: string | null;
};

export type AdminHomeSection = {
  id: string;
  key: string;
  kind: string;
  title: string | null;
  subtitle: string | null;
  body: HomeSectionBody;
  config: HomeSectionConfig;
  sortOrder: number;
  isPublished: boolean;
  publishedAt: string | null;
};
