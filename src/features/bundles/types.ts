import type { ProductCardData } from "@/features/products/types";

export type Bundle = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tag: string;
  discountPercent: number;
  products: ProductCardData[];
  originalPriceEgp: number;
  priceEgp: number;
  savingsEgp: number;
  available: boolean;
};
