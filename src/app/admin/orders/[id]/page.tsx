import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { OrderAddress } from "@/features/orders/components/OrderAddress";
import { OrderItemsList } from "@/features/orders/components/OrderItemsList";
import { OrderStatusBadge } from "@/features/orders/components/OrderStatusBadge";
import { OrderTotals } from "@/features/orders/components/OrderTotals";
import { OrderStatusForm } from "@/features/orders/components/admin/OrderStatusForm";
import { ORDER_COPY } from "@/features/orders/config/copy";
import { formatOrderDate } from "@/features/orders/lib/format-date";
import { getAdminOrder } from "@/features/orders/queries/get-admin-order";

export const metadata: Metadata = {
  title: "Order detail · Admin",
  robots: { index: false, follow: false },
};

type AdminOrderPageProps = { params: Promise<{ id: string }> };

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Order ${order.order_number}`}
        description={`${ORDER_COPY.placedLabel} ${formatOrderDate(order.placed_at)}`}
        action={
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={ADMIN_ROUTES.orders}
              className="text-surface-400 hover:text-accent text-xs font-black uppercase"
            >
              All orders
            </Link>
            <LinkButton href={ADMIN_ROUTES.orderPrint(order.id)} variant="secondary">
              Print invoice
            </LinkButton>
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OrderItemsList items={order.order_items} />
          <OrderTotals totalEgp={order.total_egp} />
        </div>
        <div className="space-y-6">
          <AdminPanel title={ORDER_COPY.statusLabel}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="text-surface-400 text-xs">Current</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <OrderStatusForm orderId={order.id} status={order.status} />
          </AdminPanel>
          <OrderAddress
            address={order.shipping_address}
            email={order.customer_email}
            phone={order.customer_phone}
          />
        </div>
      </div>
    </div>
  );
}
