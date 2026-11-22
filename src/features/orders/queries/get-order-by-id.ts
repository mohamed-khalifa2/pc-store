import "server-only";

import { z } from "zod";

import { ORDER_COPY } from "@/features/orders/config/copy";
import { orderWithItemsSchema } from "@/features/orders/schemas/order";
import type { OrderDetailData } from "@/features/orders/types";
import { createClient } from "@/lib/supabase/server";

export type OrderDetailResult =
  { ok: true; order: OrderDetailData } | { ok: false; notFound: boolean; message: string };

export async function getOrderById(rawId: string): Promise<OrderDetailResult> {
  const id = z.uuid().safeParse(rawId);
  if (!id.success) {
    return { ok: false, notFound: true, message: ORDER_COPY.detailNotFound };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id.data)
    .maybeSingle();

  if (error) {
    return { ok: false, notFound: false, message: ORDER_COPY.loadError };
  }
  if (!data) {
    return { ok: false, notFound: true, message: ORDER_COPY.detailNotFound };
  }

  const parsed = orderWithItemsSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, notFound: false, message: ORDER_COPY.loadError };
  }

  return { ok: true, order: parsed.data };
}
