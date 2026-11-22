import { CartLineItem } from "@/features/cart/components/CartLineItem";
import type { CartDetailLine } from "@/features/cart/schemas/cart-details";

type CartLineListProps = {
  lines: CartDetailLine[];
};

export function CartLineList({ lines }: CartLineListProps) {
  return (
    <ul className="divide-surface-800 divide-y">
      {lines.map((line) => (
        <CartLineItem key={line.id} line={line} />
      ))}
    </ul>
  );
}
