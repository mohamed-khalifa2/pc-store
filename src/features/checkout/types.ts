import type { PricedCartItem } from "@/features/checkout/lib/pricing";

export type CheckoutSummaryItem = PricedCartItem & {
  name: string;
  sku: string;
};

export type CheckoutSummaryState = {
  status: "idle" | "ready" | "empty" | "error";
  items: CheckoutSummaryItem[];
  totalEgp: number;
  message: string | null;
};

export const initialCheckoutSummary: CheckoutSummaryState = {
  status: "idle",
  items: [],
  totalEgp: 0,
  message: null,
};
