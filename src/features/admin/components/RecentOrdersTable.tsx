import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { formatOrderDate } from "@/features/orders/lib/format-date";
import type { OrderSummary } from "@/features/orders/types";
import { formatEgp } from "@/lib/format/currency";

const GUEST_LABEL = "Guest";

const columns: DataTableColumn<OrderSummary>[] = [
  {
    key: "order",
    label: "Order",
    cell: (order) => (
      <Link
        href={ADMIN_ROUTES.order(order.id)}
        className="text-accent hover:text-accent-strong font-mono text-xs font-bold"
      >
        {order.order_number}
      </Link>
    ),
  },
  {
    key: "customer",
    label: "Customer",
    cell: (order) => (
      <div>
        <p className="text-sm font-bold text-white">
          {order.customer_email ?? order.customer_phone ?? GUEST_LABEL}
        </p>
        <p className="text-surface-500 text-xs">{formatOrderDate(order.placed_at)}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    cell: (order) => <OrderStatusBadge status={order.status} />,
  },
  {
    key: "total",
    label: "Total",
    cell: (order) => <span className="font-bold text-white">{formatEgp(order.total_egp)}</span>,
  },
];

export function RecentOrdersTable({ orders }: { orders: readonly OrderSummary[] }) {
  return (
    <DataTable
      caption="Recent store orders"
      columns={columns}
      rows={orders}
      getRowId={(order) => order.id}
      empty={
        <EmptyState
          title={ADMIN_COPY.noRows}
          description="New orders will appear here as they are placed."
        />
      }
    />
  );
}
