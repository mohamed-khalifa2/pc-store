import { CART_COPY } from "@/features/cart/config/cart-config";

export function getStockWarning(stock: number, quantity: number): string | null {
  if (quantity <= stock) return null;
  if (stock <= 0) return CART_COPY.outOfStock;

  const itemLabel = stock === 1 ? CART_COPY.itemSingular : CART_COPY.itemPlural;
  return `${CART_COPY.only} ${stock} ${itemLabel} ${CART_COPY.stockLeft}`;
}
