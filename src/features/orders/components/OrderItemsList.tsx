import { ORDER_COPY } from "@/features/orders/config/copy";
import type { OrderItem } from "@/features/orders/types";
import { formatEgp } from "@/lib/format/currency";

export function OrderItemsList({ items }: { items: OrderItem[] }) {
  return (
    <div className="border-surface-800 bg-surface-900/60 rounded-card border p-6 sm:p-8">
      <h2 className="text-lg font-black text-white">{ORDER_COPY.itemsTitle}</h2>
      <ul className="border-surface-800 mt-6 divide-y border-t">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4 py-4 text-sm">
            <div className="min-w-0">
              <p className="truncate font-bold text-white">{item.product_name}</p>
              <p className="text-surface-400 text-xs">
                {item.sku} · {item.quantity} × {formatEgp(item.unit_price_egp)}
              </p>
            </div>
            <p className="text-accent shrink-0 font-bold">
              {formatEgp(item.line_total_egp ?? item.unit_price_egp * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
