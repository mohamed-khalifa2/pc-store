export const BANNER_PLACEMENTS = {
  home: "home",
  category: "category",
  cart: "cart",
  checkout: "checkout",
} as const;

export type BannerPlacement = (typeof BANNER_PLACEMENTS)[keyof typeof BANNER_PLACEMENTS];

export const BANNER_PLACEMENT_OPTIONS = [
  { value: BANNER_PLACEMENTS.home, label: "Home page" },
  { value: BANNER_PLACEMENTS.category, label: "Category pages" },
  { value: BANNER_PLACEMENTS.cart, label: "Cart" },
  { value: BANNER_PLACEMENTS.checkout, label: "Checkout" },
] as const;
