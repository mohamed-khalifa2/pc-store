import { ROUTES } from "@/lib/constants";

export const PRIMARY_NAV_ITEMS = [
  { label: "Products", href: ROUTES.products },
  { label: "Categories", href: ROUTES.categories },
  { label: "Cart", href: ROUTES.cart },
] as const;

export const FOOTER_NAV_ITEMS = [
  { label: "Products", href: ROUTES.products },
  { label: "Orders", href: ROUTES.orders },
  { label: "Login", href: ROUTES.login },
] as const;
