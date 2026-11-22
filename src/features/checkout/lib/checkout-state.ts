import type { CheckoutFieldErrors } from "@/features/checkout/lib/field-errors";

export type CheckoutState = {
  ok: boolean;
  message: string | null;
  fieldErrors: CheckoutFieldErrors;
  orderId?: string;
  orderNumber?: string;
};

export const initialCheckoutState: CheckoutState = {
  ok: false,
  message: null,
  fieldErrors: {},
};
