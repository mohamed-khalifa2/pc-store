import { SITE_CONTENT_KEYS, type SiteContentKey } from "@/features/site-content/config/keys";

export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    adminLabel: "Facebook URL",
    key: SITE_CONTENT_KEYS.socialFacebook,
    icon: "facebook",
  },
  {
    label: "Instagram",
    adminLabel: "Instagram URL",
    key: SITE_CONTENT_KEYS.socialInstagram,
    icon: "instagram",
  },
  {
    label: "X",
    adminLabel: "X URL",
    key: SITE_CONTENT_KEYS.socialX,
    icon: "x",
  },
] as const satisfies readonly {
  label: string;
  adminLabel: string;
  key: SiteContentKey;
  icon: string;
}[];
