import type { ProductCardData } from "@/features/products/types";

export const DEFAULT_PRODUCT_IMAGE = "/images/products/generic.svg";

export const DEFAULT_PRODUCTS: readonly ProductCardData[] = [
  {
    id: "default-9800x3d",
    name: "AMD Ryzen 7 9800X3D",
    slug: "ryzen-7-9800x3d",
    description: "8-core 3D V-Cache gaming processor.",
    priceEgp: 18999,
    compareAtPrice: 20999,
    stock: 24,
    imageUrl: DEFAULT_PRODUCT_IMAGE,
  },
  {
    id: "default-x870e",
    name: "ASUS ROG Strix X870E-E",
    slug: "asus-rog-strix-x870e-e",
    description: "Flagship AM5 motherboard.",
    priceEgp: 15999,
    compareAtPrice: null,
    stock: 8,
    imageUrl: DEFAULT_PRODUCT_IMAGE,
  },
  {
    id: "default-rtx-5080",
    name: "NVIDIA GeForce RTX 5080",
    slug: "rtx-5080",
    description: "4K gaming with DLSS 4.",
    priceEgp: 48999,
    compareAtPrice: null,
    stock: 6,
    imageUrl: DEFAULT_PRODUCT_IMAGE,
  },
  {
    id: "default-o11-evo",
    name: "Lian Li O11 Dynamic EVO XL",
    slug: "lian-li-o11-dynamic-evo-xl",
    description: "Showcase case with dual-chamber layout.",
    priceEgp: 8999,
    compareAtPrice: null,
    stock: 9,
    imageUrl: DEFAULT_PRODUCT_IMAGE,
  },
] as const;
