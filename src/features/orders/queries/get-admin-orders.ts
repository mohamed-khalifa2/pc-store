import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import type { OrderStatus } from "@/features/orders/schemas/order";
import { orderRowSchema } from "@/features/orders/schemas/order";
import type { OrderSummary } from "@/features/orders/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingRelationError } from "@/lib/supabase/query-errors";

export const ALL_ORDER_STATUSES = "all";

const ORDER_COLUMNS =
  "id, order_number, user_id, status, total_egp, currency, placed_at, customer_email, customer_phone, shipping_address";

export async function getAdminOrders(status: OrderStatus | null): Promise<OrderSummary[]> {
  await requireAdmin();

  const client = createAdminClient();
  let query = client.from("orders").select(ORDER_COLUMNS).order("placed_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (isMissingRelationError(error)) return [];
  if (error) throw new Error(ADMIN_COPY.loadError);

  const parsed = z.array(orderRowSchema).safeParse(data ?? []);
  if (!parsed.success) throw new Error(ADMIN_COPY.loadError);

  return parsed.data;
}
