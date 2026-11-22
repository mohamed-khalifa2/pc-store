import { DEFAULT_PRODUCT_IMAGE } from "@/features/products/config/defaults";
import type { ProductDetailData } from "@/features/products/types";

const image = { url: DEFAULT_PRODUCT_IMAGE, alt: "Product preview" };

export const DEFAULT_PRODUCT_DETAILS: readonly ProductDetailData[] = [
  {
    id: "default-9800x3d",
    name: "AMD Ryzen 7 9800X3D",
    slug: "ryzen-7-9800x3d",
    description: "8-core 3D V-Cache gaming processor.",
    priceEgp: 18999,
    compareAtPrice: 20999,
    stock: 24,
    imageUrl: DEFAULT_PRODUCT_IMAGE,
    sku: "CPU-AMD-9800X3D",
    category: { name: "CPUs", slug: "cpus" },
    specs: [
      { label: "Socket", value: "AM5" },
      { label: "Cores", value: "8" },
      { label: "Boost", value: "5.2 GHz" },
      { label: "Cache", value: "96 MB" },
    ],
    images: [image],
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
    sku: "MB-ASUS-X870E-E",
    category: { name: "Motherboards", slug: "motherboards" },
    specs: [
      { label: "Chipset", value: "X870E" },
      { label: "Form factor", value: "ATX" },
      { label: "Memory", value: "DDR5" },
    ],
    images: [image],
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
    sku: "GPU-NV-5080",
    category: { name: "Graphics Cards", slug: "graphics-cards" },
    specs: [
      { label: "VRAM", value: "16 GB" },
      { label: "Architecture", value: "Blackwell" },
      { label: "Bus", value: "PCIe 5.0" },
    ],
    images: [image],
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
    sku: "CASE-LIAN-O11-EVO-XL",
    category: { name: "PC Cases", slug: "pc-cases" },
    specs: [
      { label: "Form factor", value: "ATX" },
      { label: "Side panel", value: "Tempered glass" },
      { label: "Fans included", value: "0" },
    ],
    images: [image],
  },
] as const;

export const DEFAULT_PRODUCT_SLUGS = DEFAULT_PRODUCT_DETAILS.map((product) => product.slug);
