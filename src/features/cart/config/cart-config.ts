import { NAV_LABELS } from "@/lib/constants";

export const CART_STORAGE_KEY = "pc-store-cart";
export const CART_STORAGE_VERSION = 1;

export const CART_KEYBOARD = {
  escape: "Escape",
} as const;

export const CART_COPY = {
  title: "Your cart",
  openCart: "Open cart",
  closeCart: "Close cart",
  loading: "Loading cart",
  loadErrorTitle: "Your cart could not be loaded",
  loadErrorDescription: "Please try again or continue browsing the catalog.",
  emptyTitle: "Your cart is empty",
  emptyDescription: "Add a build-worthy upgrade to get started.",
  shopProducts: "Browse products",
  decreaseQuantity: "Decrease quantity of",
  increaseQuantity: "Increase quantity of",
  remove: "Remove",
  each: "each",
  subtotal: "Subtotal",
  checkout: "Checkout",
  stockIssue: "Resolve stock issues before checkout",
  outOfStock: "Out of stock",
  only: "Only",
  stockLeft: "left in stock",
  itemSingular: "item",
  itemPlural: "items",
} as const;

export function cartAccessibleLabel(count: number): string {
  const itemLabel = count === 1 ? CART_COPY.itemSingular : CART_COPY.itemPlural;
  return `${NAV_LABELS.cart}, ${count} ${itemLabel}`;
}
