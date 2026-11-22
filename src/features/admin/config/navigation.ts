import { ADMIN_ROUTES } from "@/features/admin/config/routes";

export const ADMIN_NAV_ITEMS = [
  { href: ADMIN_ROUTES.overview, label: "Overview", short: "OV" },
  { href: ADMIN_ROUTES.banners, label: "Banners", short: "BN" },
  { href: ADMIN_ROUTES.content, label: "Home builder", short: "HB" },
  { href: ADMIN_ROUTES.products, label: "Products", short: "PR" },
  { href: ADMIN_ROUTES.categories, label: "Categories", short: "CA" },
  { href: ADMIN_ROUTES.orders, label: "Orders", short: "OR" },
  { href: ADMIN_ROUTES.settings, label: "Settings", short: "SE" },
] as const;
