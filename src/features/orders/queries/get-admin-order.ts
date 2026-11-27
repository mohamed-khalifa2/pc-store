import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { orderWithItemsSchema } from "@/features/orders/schemas/order";
import type { OrderDetailData } from "@/features/orders/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { isMissingRelationError } from "@/lib/supabase/query-errors";

export async function getAdminOrder(rawId: string): Promise<OrderDetailData | null> {
  await requireAdmin();

  const id = z.uuid().safeParse(rawId);
  if (!id.success) return null;

  const client = createAdminClient();
  const { data, error } = await client
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id.data)
    .maybeSingle();

  if (isMissingRelationError(error)) return null;
  if (error) throw new Error(ADMIN_COPY.loadError);
  if (!data) return null;

  const parsed = orderWithItemsSchema.safeParse(data);
  if (!parsed.success) throw new Error(ADMIN_COPY.loadError);

  return parsed.data;
}
