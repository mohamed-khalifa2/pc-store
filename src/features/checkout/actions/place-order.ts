"use server";

import { revalidateTag, updateTag } from "next/cache";

import { requireUser } from "@/features/auth/lib/require-user";
import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { SHIPPING_KEYS } from "@/features/checkout/config/shipping-keys";
import { checkoutFormSchema, parseCartInput } from "@/features/checkout/schemas/checkout";
import type { CheckoutState } from "@/features/checkout/lib/checkout-state";
import { checkoutFormValue } from "@/features/checkout/lib/form-data";
import { fieldError, validationError } from "@/features/checkout/lib/field-errors";
import { callPlaceOrderRpc, type PlaceOrderResult } from "@/features/checkout/lib/place-order-rpc";
import { priceCartItems } from "@/features/checkout/lib/pricing";
import { getPaymentProvider } from "@/features/checkout/payments";
import { getProductsByIds } from "@/features/products/queries/get-products-by-ids";
import { CACHE_TAGS, CHECKOUT_FIELDS } from "@/lib/constants";
import type { Json } from "@/lib/supabase/types";

export async function placeOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = checkoutFormSchema.safeParse({
    [CHECKOUT_FIELDS.fullName]: checkoutFormValue(formData, CHECKOUT_FIELDS.fullName),
    [CHECKOUT_FIELDS.phone]: checkoutFormValue(formData, CHECKOUT_FIELDS.phone),
    [CHECKOUT_FIELDS.governorate]: checkoutFormValue(formData, CHECKOUT_FIELDS.governorate),
    [CHECKOUT_FIELDS.city]: checkoutFormValue(formData, CHECKOUT_FIELDS.city),
    [CHECKOUT_FIELDS.address]: checkoutFormValue(formData, CHECKOUT_FIELDS.address),
    [CHECKOUT_FIELDS.notes]: checkoutFormValue(formData, CHECKOUT_FIELDS.notes),
    [CHECKOUT_FIELDS.items]: checkoutFormValue(formData, CHECKOUT_FIELDS.items),
    [CHECKOUT_FIELDS.paymentProvider]: checkoutFormValue(formData, CHECKOUT_FIELDS.paymentProvider),
  });

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const items = parseCartInput(parsed.data[CHECKOUT_FIELDS.items]);
  if (!items || items.length === 0) {
    return fieldError(CHECKOUT_FIELDS.items, CHECKOUT_COPY.cartEmpty);
  }

  const user = await requireUser();
  const products = await getProductsByIds(items.map((item) => item.productId));
  const pricing = priceCartItems(items, products);
  if (!pricing.ok) {
    return fieldError(CHECKOUT_FIELDS.items, pricing.message);
  }

  const provider = getPaymentProvider(parsed.data[CHECKOUT_FIELDS.paymentProvider]);
  if (!provider?.isAvailable()) {
    return fieldError(CHECKOUT_FIELDS.paymentProvider, CHECKOUT_COPY.paymentUnavailable);
  }

  const shippingAddress: Json = {
    [SHIPPING_KEYS.fullName]: parsed.data[CHECKOUT_FIELDS.fullName],
    [SHIPPING_KEYS.phone]: parsed.data[CHECKOUT_FIELDS.phone],
    [SHIPPING_KEYS.governorate]: parsed.data[CHECKOUT_FIELDS.governorate],
    [SHIPPING_KEYS.city]: parsed.data[CHECKOUT_FIELDS.city],
    [SHIPPING_KEYS.address]: parsed.data[CHECKOUT_FIELDS.address],
    [SHIPPING_KEYS.notes]: parsed.data[CHECKOUT_FIELDS.notes],
  };
  const rpcItems: Json = pricing.items.map((item) => ({
    product_id: item.productId,
    quantity: item.quantity,
  }));

  let result: PlaceOrderResult;
  try {
    result = await callPlaceOrderRpc({
      p_user_id: user.sub,
      p_items: rpcItems,
      p_shipping_address: shippingAddress,
      p_customer_email: user.email ?? null,
      p_customer_phone: parsed.data[CHECKOUT_FIELDS.phone],
    });
  } catch {
    return { ok: false, message: CHECKOUT_COPY.placeOrderError, fieldErrors: {} };
  }

  const payment = await provider.pay({
    orderId: result.order_id,
    orderNumber: result.order_number,
    totalEgp: pricing.totalEgp,
    customerEmail: user.email ?? null,
  });

  revalidateTag(CACHE_TAGS.products, "max");
  updateTag(CACHE_TAGS.orders);

  return {
    ok: true,
    message: payment.kind === "confirmation" ? payment.message : null,
    fieldErrors: {},
    orderId: result.order_id,
    orderNumber: result.order_number,
  };
}
