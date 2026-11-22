import { PAYMENT_COPY } from "@/features/checkout/config/payment-copy";
import type { PaymentProvider } from "@/features/checkout/payments/types";
import { PAYMENT_PROVIDERS } from "@/lib/constants";

export const codProvider: PaymentProvider = {
  id: PAYMENT_PROVIDERS.cod,
  label: "Cash on delivery",
  description: "Pay when your order arrives.",
  isAvailable: () => true,
  pay: async () => ({
    kind: "confirmation",
    message: PAYMENT_COPY.codConfirmation,
  }),
};
