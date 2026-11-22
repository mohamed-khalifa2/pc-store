import type { PaymentProviderId } from "@/lib/constants";

export type PaymentContext = {
  orderId: string;
  orderNumber: string;
  totalEgp: number;
  customerEmail: string | null;
};

export type PaymentResult =
  { kind: "confirmation"; message: string } | { kind: "redirect"; url: string };

export type PaymentProvider = {
  id: PaymentProviderId;
  label: string;
  description: string;
  isAvailable: () => boolean;
  pay: (context: PaymentContext) => Promise<PaymentResult>;
};
