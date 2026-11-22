import type { Json } from "@/lib/supabase/types";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductImageData = {
  url: string;
  alt: string;
};

export type ProductCategoryRef = {
  name: string;
  slug: string;
};

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceEgp: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
};

export type ProductDetailData = ProductCardData & {
  sku: string;
  category: ProductCategoryRef | null;
  specs: ProductSpec[];
  images: ProductImageData[];
};

export type CheckoutProductData = {
  id: string;
  name: string;
  sku: string;
  priceEgp: number;
  stock: number;
  specs: Json;
};

export type ProductListResult = {
  items: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
};
