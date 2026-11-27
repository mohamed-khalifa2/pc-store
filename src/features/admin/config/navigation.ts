import { ADMIN_ROUTES } from "@/features/admin/config/routes";

export const ADMIN_NAV_ITEMS = [
  { href: ADMIN_ROUTES.overview, label: "Overview" },
  { href: ADMIN_ROUTES.banners, label: "Hero & banners" },
  { href: ADMIN_ROUTES.content, label: "Home builder" },
  { href: ADMIN_ROUTES.bundles, label: "Bundles" },
  { href: ADMIN_ROUTES.products, label: "Products" },
  { href: ADMIN_ROUTES.categories, label: "Categories" },
  { href: ADMIN_ROUTES.orders, label: "Orders" },
  { href: ADMIN_ROUTES.settings, label: "Settings" },
] as const;
