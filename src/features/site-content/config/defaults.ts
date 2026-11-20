import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import type { SiteContent } from "@/features/site-content/types";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  [SITE_CONTENT_KEYS.name]: SITE_NAME,
  [SITE_CONTENT_KEYS.description]: SITE_DESCRIPTION,
  [SITE_CONTENT_KEYS.email]: "sales@example.com",
  [SITE_CONTENT_KEYS.phone]: "+20 100 000 0000",
  [SITE_CONTENT_KEYS.shippingNote]: "Free Cairo delivery on orders above 10,000 EGP.",
  [SITE_CONTENT_KEYS.homeTitle]: `${SITE_NAME} — Builds that refuse to compromise`,
};
