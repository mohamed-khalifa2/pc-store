import { z } from "zod";

import { verifyPaymobSignature } from "@/features/checkout/payments/verify-webhook";
import { PAYMOB_HEADERS } from "@/lib/constants";

const WEBHOOK_ERRORS = {
  invalidSignature: "Invalid signature",
  invalidJson: "Invalid JSON",
  invalidPayload: "Invalid payload",
} as const;

const paymobWebhookSchema = z.object({
  type: z.string().min(1),
  obj: z.object({
    id: z.number().int(),
    success: z.boolean(),
    order: z.object({ id: z.number().int() }),
  }),
});

export async function POST(request: Request): Promise<Response> {
  const payload = await request.text();
  const signature = request.headers.get(PAYMOB_HEADERS.signature);

  if (!(await verifyPaymobSignature(payload, signature))) {
    return Response.json({ error: WEBHOOK_ERRORS.invalidSignature }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(payload) as unknown;
  } catch {
    return Response.json({ error: WEBHOOK_ERRORS.invalidJson }, { status: 400 });
  }

  const parsed = paymobWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: WEBHOOK_ERRORS.invalidPayload }, { status: 400 });
  }

  // TODO: reconcile `parsed.data.obj.order.id` with an order, verify amount,
  // then mark it paid with the admin client and revalidate CACHE_TAGS.orders.
  return Response.json({ received: true });
}
