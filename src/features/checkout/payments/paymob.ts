import { PAYMENT_COPY } from "@/features/checkout/config/payment-copy";
import type { PaymentProvider } from "@/features/checkout/payments/types";
import { getEnv } from "@/lib/env";
import { PAYMENT_PROVIDERS } from "@/lib/constants";

type PaymobConfig = {
  apiKey: string;
  secretKey: string;
  integrationId: string;
};

export function readPaymobConfig(): PaymobConfig | null {
  const env = getEnv();

  if (!env.PAYMOB_API_KEY || !env.PAYMOB_SECRET_KEY || !env.PAYMOB_INTEGRATION_ID) {
    return null;
  }

  return {
    apiKey: env.PAYMOB_API_KEY,
    secretKey: env.PAYMOB_SECRET_KEY,
    integrationId: env.PAYMOB_INTEGRATION_ID,
  };
}

export const paymobProvider: PaymentProvider = {
  id: PAYMENT_PROVIDERS.paymob,
  label: "PayMob",
  description: "Card payment integration (not enabled yet).",
  // TODO: enable once pay() returns a real payment URL.
  isAvailable: () => false,
  pay: async () => {
    const config = readPaymobConfig();
    if (!config) {
      throw new Error(PAYMENT_COPY.paymobMissingConfig);
    }
    // TODO: use config to request an auth token, order id, and payment key.
    // TODO: return { kind: "redirect", url } from the payment key response.
    throw new Error(PAYMENT_COPY.paymobNotImplemented);
  },
};
