import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

import { HERO_STEPS } from "@/features/scroll-hero/config/steps";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import type { SiteContent } from "@/features/site-content/types";

const [power, precision, delivery] = HERO_STEPS;

export const DEFAULT_SITE_CONTENT: SiteContent = {
  [SITE_CONTENT_KEYS.name]: SITE_NAME,
  [SITE_CONTENT_KEYS.description]: SITE_DESCRIPTION,
  [SITE_CONTENT_KEYS.email]: "sales@example.com",
  [SITE_CONTENT_KEYS.phone]: "+20 100 000 0000",
  [SITE_CONTENT_KEYS.address]: "Cairo, Egypt",
  [SITE_CONTENT_KEYS.shippingNote]: "Free Cairo delivery on orders above 10,000 EGP.",
  [SITE_CONTENT_KEYS.homeTitle]: `${SITE_NAME} — Builds that refuse to compromise`,
  [SITE_CONTENT_KEYS.seoTitle]: `${SITE_NAME} — PC parts and upgrades`,
  [SITE_CONTENT_KEYS.seoDescription]: SITE_DESCRIPTION,
  [SITE_CONTENT_KEYS.footerText]: `© ${SITE_NAME}. All rights reserved.`,
  [SITE_CONTENT_KEYS.socialFacebook]: "https://facebook.com",
  [SITE_CONTENT_KEYS.socialInstagram]: "https://instagram.com",
  [SITE_CONTENT_KEYS.socialX]: "https://x.com",
  [SITE_CONTENT_KEYS.heroTitle]: power?.title ?? "Built for",
  [SITE_CONTENT_KEYS.heroSubtitle]: power?.body ?? "",
  [SITE_CONTENT_KEYS.heroBadge]: power?.eyebrow ?? "01 / Performance",
  [SITE_CONTENT_KEYS.step1Eyebrow]: power?.eyebrow ?? "",
  [SITE_CONTENT_KEYS.step1Title]: power?.title ?? "",
  [SITE_CONTENT_KEYS.step1Accent]: power?.accent ?? "",
  [SITE_CONTENT_KEYS.step1Body]: power?.body ?? "",
  [SITE_CONTENT_KEYS.step2Eyebrow]: precision?.eyebrow ?? "",
  [SITE_CONTENT_KEYS.step2Title]: precision?.title ?? "",
  [SITE_CONTENT_KEYS.step2Accent]: precision?.accent ?? "",
  [SITE_CONTENT_KEYS.step2Body]: precision?.body ?? "",
  [SITE_CONTENT_KEYS.step3Eyebrow]: delivery?.eyebrow ?? "",
  [SITE_CONTENT_KEYS.step3Title]: delivery?.title ?? "",
  [SITE_CONTENT_KEYS.step3Accent]: delivery?.accent ?? "",
  [SITE_CONTENT_KEYS.step3Body]: delivery?.body ?? "",
  [SITE_CONTENT_KEYS.step3Cta]: delivery?.ctaLabel ?? "Shop components",
};
