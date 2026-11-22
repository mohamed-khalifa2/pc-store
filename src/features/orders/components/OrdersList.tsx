import Link from "next/link";

import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { formatOrderDate } from "@/features/orders/lib/format-date";
import type { OrderSummary } from "@/features/orders/types";
import { ROUTES } from "@/lib/constants";
import { formatEgp } from "@/lib/format/currency";

export function OrdersList({ orders }: { orders: OrderSummary[] }) {
  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={ROUTES.order(order.id)}
            className="border-surface-800 bg-surface-900/60 hover:border-accent rounded-card flex flex-wrap items-center justify-between gap-4 border p-6 transition-colors"
          >
            <div className="space-y-2">
              <p className="font-mono text-sm font-bold text-white">{order.order_number}</p>
              <p className="text-surface-400 text-xs">{formatOrderDate(order.placed_at)}</p>
            </div>
            <div className="flex items-center gap-6">
              <OrderStatusBadge status={order.status} />
              <p className="text-accent text-lg font-black">{formatEgp(order.total_egp)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
