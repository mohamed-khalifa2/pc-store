"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { CHECKOUT_COPY } from "@/features/checkout/config/copy";

export function CheckoutSubmit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="w-full"
      disabled={pending || disabled}
      aria-busy={pending}
    >
      {pending ? CHECKOUT_COPY.placeOrderPending : CHECKOUT_COPY.placeOrderSubmit}
    </Button>
  );
}
