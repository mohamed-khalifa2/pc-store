import { PAYMENT_PROVIDERS } from "@/lib/constants";

export type PaymentOption = {
  id: (typeof PAYMENT_PROVIDERS)[keyof typeof PAYMENT_PROVIDERS];
  label: string;
  description: string;
  available: boolean;
};

export const PAYMENT_OPTIONS: readonly PaymentOption[] = [
  {
    id: PAYMENT_PROVIDERS.cod,
    label: "Cash on delivery",
    description: "Pay when your order arrives. No redirect needed.",
    available: true,
  },
  {
    id: PAYMENT_PROVIDERS.paymob,
    label: "PayMob",
    description: "Card payment is being connected and is not available yet.",
    available: false,
  },
];
