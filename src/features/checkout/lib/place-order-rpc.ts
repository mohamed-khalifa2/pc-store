import "server-only";

import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

export const PLACE_ORDER_RPC = "place_order" as const;

export type PlaceOrderRpcInput = {
  p_user_id: string;
  p_items: Json;
  p_shipping_address: Json;
  p_customer_email: string | null;
  p_customer_phone: string;
};

export const placeOrderResultSchema = z.object({
  order_id: z.uuid(),
  order_number: z.string().min(1),
  total_egp: z.number().nonnegative(),
});

export type PlaceOrderResult = z.infer<typeof placeOrderResultSchema>;

type RpcErrorLike = { message: string };
type RpcResponse = { data: unknown; error: RpcErrorLike | null };

type PlaceOrderRpcClient = {
  rpc: (name: typeof PLACE_ORDER_RPC, args: PlaceOrderRpcInput) => Promise<RpcResponse>;
};

// Generated Supabase types cannot be regenerated without a container runtime here.
// This narrow structural contract is validated with Zod until `pnpm db:types` is rerun.
export async function callPlaceOrderRpc(input: PlaceOrderRpcInput): Promise<PlaceOrderResult> {
  const supabase = createAdminClient() as unknown as PlaceOrderRpcClient;
  const { data, error } = await supabase.rpc(PLACE_ORDER_RPC, input);

  if (error) {
    throw new Error(error.message);
  }

  return placeOrderResultSchema.parse(data);
}
