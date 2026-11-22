import type { Json } from "@/lib/supabase/types";

export type AdminProductImage = {
  id: string;
  storagePath: string;
  altText: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  priceEgp: number;
  compareAtPrice: number | null;
  stock: number;
  categoryId: string | null;
  specs: Json;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  publishedAt: string | null;
};

export type AdminProductDetail = AdminProduct & {
  images: AdminProductImage[];
};
