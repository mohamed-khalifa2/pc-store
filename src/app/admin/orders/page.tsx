import type { Metadata } from "next";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { AdminOrderTable } from "@/features/orders/components/admin/AdminOrderTable";
import { OrderStatusFilter } from "@/features/orders/components/admin/OrderStatusFilter";
import { ALL_ORDER_STATUSES, getAdminOrders } from "@/features/orders/queries/get-admin-orders";
import { orderStatusSchema } from "@/features/orders/schemas/order";

export const metadata: Metadata = {
  title: "Orders · Admin",
  robots: { index: false, follow: false },
};

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const query = await searchParams;
  const rawStatus = typeof query.status === "string" ? query.status : ALL_ORDER_STATUSES;
  const parsedStatus =
    rawStatus === ALL_ORDER_STATUSES ? null : orderStatusSchema.safeParse(rawStatus);
  const status = parsedStatus?.success ? parsedStatus.data : null;
  const orders = await getAdminOrders(status);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Orders"
        description="Review every order and move it through fulfilment."
      />
      <AdminPanel>
        <OrderStatusFilter status={status ?? ALL_ORDER_STATUSES} />
      </AdminPanel>
      <AdminPanel>
        <AdminOrderTable rows={orders} />
      </AdminPanel>
    </div>
  );
}
