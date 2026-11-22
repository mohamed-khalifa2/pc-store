"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { placeOrder } from "@/features/checkout/actions/place-order";
import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { CheckoutSubmit } from "@/features/checkout/components/CheckoutSubmit";
import { CheckoutSummary } from "@/features/checkout/components/CheckoutSummary";
import { PaymentOptions } from "@/features/checkout/components/PaymentOptions";
import { ShippingFields } from "@/features/checkout/components/ShippingFields";
import { useCheckoutCart } from "@/features/checkout/hooks/use-checkout-cart";
import { initialCheckoutState } from "@/features/checkout/lib/checkout-state";
import { CHECKOUT_FIELDS, ROUTES } from "@/lib/constants";

export function CheckoutForm({ email }: { email?: string }) {
  const router = useRouter();
  const { items, hydrated, clearCart } = useCheckoutCart();
  const itemsJson = JSON.stringify(items);
  const [state, formAction, pending] = useActionState(placeOrder, initialCheckoutState);

  useEffect(() => {
    if (state.ok && state.orderId) {
      clearCart();
      router.push(ROUTES.order(state.orderId));
    }
  }, [state.ok, state.orderId, clearCart, router]);

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-8">
        {email ? <p className="text-surface-400 text-xs">Signed in as {email}</p> : null}
        <ShippingFields fieldErrors={state.fieldErrors} />
        <PaymentOptions error={state.fieldErrors[CHECKOUT_FIELDS.paymentProvider]?.[0]} />
        {state.message ? (
          <p className="text-danger text-sm font-semibold" role={state.ok ? "status" : "alert"}>
            {state.message}
          </p>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <CheckoutSummary itemsJson={itemsJson} enabled={hydrated} />
      </aside>

      <input type="hidden" name={CHECKOUT_FIELDS.items} value={itemsJson} readOnly />
      <div className="space-y-3 lg:col-span-2" aria-busy={pending}>
        <CheckoutSubmit disabled={!hydrated || items.length === 0} />
        {hydrated && items.length === 0 ? (
          <p className="text-danger text-center text-xs">{CHECKOUT_COPY.cartEmpty}</p>
        ) : null}
      </div>
    </form>
  );
}
