"use server";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { orderStatusSchema } from "@/features/orders/schemas/order";
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

const updateStatusSchema = z.object({
  orderId: z.uuid(),
  status: orderStatusSchema,
});

export async function updateOrderStatus(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = updateStatusSchema.safeParse({
    orderId: formString(formData, "orderId"),
    status: formString(formData, "status"),
  });
  if (!parsed.success) return adminValidation(parsed.error, "Choose a valid order status.");

  const client = createAdminClient();
  const { data, error } = await client
    .from("orders")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.orderId)
    .select("id")
    .maybeSingle();

  if (error) return adminFailure("The order status could not be updated.");
  if (!data) return adminFailure("That order no longer exists.");

  revalidatePublic([CACHE_TAGS.orders]);
  return adminSuccess("Order status updated.");
}
