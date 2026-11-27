import { DEFAULT_HOME_SECTIONS } from "@/features/home/config/defaults";
import type { AdminHomeSection } from "@/features/site-content/types.admin";

export function defaultAdminHomeSections(): AdminHomeSection[] {
  return DEFAULT_HOME_SECTIONS.map((section) => ({
    ...section,
    body: { ...section.body },
    config: { ...section.config },
    isPublished: true,
    publishedAt: null,
  }));
}
