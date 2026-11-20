export const SITE_NAME = "PC//STORE";

export const SITE_DESCRIPTION =
  "High-performance PC parts, prebuilts, and upgrades for builders who refuse to compromise.";

export const DEFAULT_SITE_URL = "http://localhost:3000";

export const ADMIN_ROLE = "admin";
export const ADMIN_PATH_PREFIX = "/admin";

export const NEXT_PARAM = "next";

export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
  banners: "banners",
  siteContent: "site-content",
  homeSections: "home-sections",
  orders: "orders",
} as const;

export const STORAGE_BUCKETS = {
  banners: "banners",
  siteAssets: "site-assets",
  productImages: "product-images",
} as const;

export const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMGEwYTBhIi8+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjMiIGZpbGw9IiNiOGZmMmUiLz48L3N2Zz4=";

export const ROUTES = {
  home: "/",
  products: "/products",
  product: (slug: string) => `/products/${slug}`,
  categories: "/categories",
  category: (slug: string) => `/categories/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  orders: "/orders",
  order: (id: string) => `/orders/${id}`,
  login: "/login",
  signup: "/signup",
  admin: "/admin",
} as const;

export const NAV_LABELS = {
  primary: "Primary navigation",
  mobile: "Mobile navigation",
  footer: "Footer navigation",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  cart: "Cart",
} as const;

export const CART_COUNT_PLACEHOLDER = 0;
