import "server-only";

import { z } from "zod";

import { ORDER_COPY } from "@/features/orders/config/copy";
import { orderRowSchema } from "@/features/orders/schemas/order";
import type { OrderSummary } from "@/features/orders/types";
import { createClient } from "@/lib/supabase/server";

export type MyOrdersResult = { ok: true; orders: OrderSummary[] } | { ok: false; message: string };

export async function getMyOrders(): Promise<MyOrdersResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false });

  if (error) {
    return { ok: false, message: ORDER_COPY.loadError };
  }

  const parsed = z.array(orderRowSchema).safeParse(data);
  if (!parsed.success) {
    return { ok: false, message: ORDER_COPY.loadError };
  }

  return { ok: true, orders: parsed.data };
}
