import { ROUTES } from "@/lib/constants";

export const PRIMARY_NAV_ITEMS = [
  { label: "Products", href: ROUTES.products },
  { label: "Bundles", href: ROUTES.bundles },
  { label: "Categories", href: ROUTES.categories },
] as const;

export const FOOTER_NAV_ITEMS = [
  { label: "Products", href: ROUTES.products },
  { label: "Bundles", href: ROUTES.bundles },
  { label: "Categories", href: ROUTES.categories },
  { label: "Orders", href: ROUTES.orders },
  { label: "About", href: ROUTES.about },
  { label: "Terms & policies", href: ROUTES.terms },
  { label: "Login", href: ROUTES.login },
] as const;
