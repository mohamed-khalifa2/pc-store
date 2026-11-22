import { codProvider } from "@/features/checkout/payments/cod";
import { paymobProvider } from "@/features/checkout/payments/paymob";
import type { PaymentProvider } from "@/features/checkout/payments/types";
import type { PaymentProviderId } from "@/lib/constants";

const REGISTRY: readonly PaymentProvider[] = [codProvider, paymobProvider];

export function getPaymentProvider(id: PaymentProviderId): PaymentProvider | undefined {
  return REGISTRY.find((provider) => provider.id === id);
}
