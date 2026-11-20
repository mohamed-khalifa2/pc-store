import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/env";

import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import type { SiteContent } from "@/features/site-content/types";

export function buildHomeJsonLd(content: SiteContent): string {
  const siteUrl = getSiteUrl();
  const name = getSiteText(content, SITE_CONTENT_KEYS.name, SITE_NAME);
  const description = getSiteText(content, SITE_CONTENT_KEYS.description, SITE_DESCRIPTION);
  const email = getSiteText(content, SITE_CONTENT_KEYS.email, "sales@example.com");
  const phone = getSiteText(content, SITE_CONTENT_KEYS.phone, "+20 100 000 0000");

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      url: siteUrl,
      email,
      telephone: phone,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name,
      url: siteUrl,
      description,
    },
  ];

  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
