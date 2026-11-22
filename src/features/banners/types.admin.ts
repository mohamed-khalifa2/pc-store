export type AdminBanner = {
  id: string;
  name: string;
  imagePath: string;
  mobileImagePath: string | null;
  placement: string;
  headline: string | null;
  subheadline: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  sortOrder: number;
  isActive: boolean;
  publishedAt: string | null;
  startsAt: string | null;
  endsAt: string | null;
};
