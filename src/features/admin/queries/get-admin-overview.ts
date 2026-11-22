import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { orderRowSchema } from "@/features/orders/schemas/order";
import type { OrderSummary } from "@/features/orders/types";
import { createAdminClient } from "@/lib/supabase/admin";

const LOW_STOCK_THRESHOLD = 5;
const RECENT_ORDERS_LIMIT = 5;
const PENDING_ORDER_STATUS = "pending";

const revenueRowSchema = z.object({ total_egp: z.number().nonnegative() });

export type AdminOverviewData = {
  ordersToday: number;
  revenueToday: number;
  lowStockProducts: number;
  pendingOrders: number;
  recentOrders: OrderSummary[];
};

function startOfTodayIso(): string {
  const date = new Date();
  return `${date.toISOString().slice(0, 10)}T00:00:00.000Z`;
}

function asPromise<T>(value: PromiseLike<T>): Promise<T> {
  return Promise.resolve(value);
}

export async function getAdminOverview(): Promise<AdminOverviewData> {
  await requireAdmin();

  const client = createAdminClient();
  const today = startOfTodayIso();
  const emptyOrders: OrderSummary[] = [];

  const [ordersToday, revenueToday, lowStockProducts, pendingOrders, recentOrders] =
    await Promise.all([
      asPromise(
        client.from("orders").select("id", { count: "exact", head: true }).gte("placed_at", today),
      )
        .then(({ count }) => count ?? 0)
        .catch(() => 0),
      asPromise(client.from("orders").select("total_egp").gte("placed_at", today))
        .then(({ data, error }) => {
          if (error || !data) return 0;
          const parsed = z.array(revenueRowSchema).safeParse(data);
          return parsed.success ? parsed.data.reduce((sum, row) => sum + row.total_egp, 0) : 0;
        })
        .catch(() => 0),
      asPromise(
        client
          .from("products")
          .select("id", { count: "exact", head: true })
          .lte("stock", LOW_STOCK_THRESHOLD),
      )
        .then(({ count }) => count ?? 0)
        .catch(() => 0),
      asPromise(
        client
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", PENDING_ORDER_STATUS),
      )
        .then(({ count }) => count ?? 0)
        .catch(() => 0),
      asPromise(
        client
          .from("orders")
          .select("*")
          .order("placed_at", { ascending: false })
          .limit(RECENT_ORDERS_LIMIT),
      )
        .then(({ data, error }) => {
          if (error) return emptyOrders;
          const parsed = z.array(orderRowSchema).safeParse(data ?? []);
          return parsed.success ? parsed.data : emptyOrders;
        })
        .catch(() => emptyOrders),
    ]);

  return { ordersToday, revenueToday, lowStockProducts, pendingOrders, recentOrders };
}
