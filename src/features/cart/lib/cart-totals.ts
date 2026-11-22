import type { CartDetailLine } from "@/features/cart/schemas/cart-details";

export function getCartSubtotal(lines: CartDetailLine[]): number {
  return lines.reduce((total, line) => total + line.lineTotalEgp, 0);
}

export function hasStockIssues(lines: CartDetailLine[]): boolean {
  return lines.some((line) => line.quantity > line.stock);
}
