export const SITE_CONTENT_KEYS = {
  name: "site.name",
  description: "site.description",
  email: "contact.email",
  phone: "contact.phone",
  shippingNote: "shipping.note",
  homeTitle: "seo.home_title",
} as const;

export type SiteContentKey = (typeof SITE_CONTENT_KEYS)[keyof typeof SITE_CONTENT_KEYS];
