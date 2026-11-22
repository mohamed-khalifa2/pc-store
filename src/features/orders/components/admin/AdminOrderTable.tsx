import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { SHIPPING_KEYS } from "@/features/checkout/config/shipping-keys";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { formatOrderDate } from "@/features/orders/lib/format-date";
import type { OrderSummary } from "@/features/orders/types";
import { formatEgp } from "@/lib/format/currency";

type AdminOrderTableProps = { rows: OrderSummary[] };

export function AdminOrderTable({ rows }: AdminOrderTableProps) {
  const columns: DataTableColumn<OrderSummary>[] = [
    {
      key: "orderNumber",
      label: "Order",
      cell: (row) => (
        <Link
          href={ADMIN_ROUTES.order(row.id)}
          className="text-accent font-mono text-xs font-bold hover:underline"
        >
          {row.order_number}
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      cell: (row) => (
        <div>
          <p className="font-bold text-white">
            {row.shipping_address[SHIPPING_KEYS.fullName] || row.customer_email || "—"}
          </p>
          <p className="text-surface-500 text-xs">
            {row.customer_email ?? row.customer_phone ?? "—"}
          </p>
        </div>
      ),
    },
    {
      key: "placedAt",
      label: "Placed",
      cell: (row) => (
        <span className="text-surface-300 text-xs">{formatOrderDate(row.placed_at)}</span>
      ),
    },
    {
      key: "total",
      label: "Total",
      cell: (row) => (
        <span className="font-mono font-bold text-white">{formatEgp(row.total_egp)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      cell: (row) => <OrderStatusBadge status={row.status} />,
    },
    {
      key: "view",
      label: "",
      cell: (row) => (
        <Link
          href={ADMIN_ROUTES.order(row.id)}
          className="text-surface-400 hover:text-accent text-xs font-bold uppercase"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      caption="Admin orders"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      empty={<EmptyState title="No orders found" description="Try a different status filter." />}
    />
  );
}
