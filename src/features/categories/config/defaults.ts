import type { CategoryCardData } from "@/features/categories/types";

export const DEFAULT_CATEGORIES: readonly CategoryCardData[] = [
  {
    id: "default-cpus",
    name: "CPUs",
    slug: "cpus",
    description: "Processors for every build.",
    imageUrl: "/images/categories/cpus.png",
  },
  {
    id: "default-motherboards",
    name: "Motherboards",
    slug: "motherboards",
    description: "AM5 and LGA1851 platforms.",
    imageUrl: "/images/categories/motherboards.png",
  },
  {
    id: "default-graphics-cards",
    name: "Graphics Cards",
    slug: "graphics-cards",
    description: "GPU power for gaming and content creation.",
    imageUrl: "/images/categories/graphics-cards.png",
  },
  {
    id: "default-memory",
    name: "Memory",
    slug: "memory",
    description: "High-speed DDR5 kits.",
    imageUrl: "/images/categories/memory.png",
  },
  {
    id: "default-storage",
    name: "Storage",
    slug: "storage",
    description: "NVMe drives and fast storage.",
    imageUrl: "/images/categories/storage.png",
  },
  {
    id: "default-pc-cases",
    name: "PC Cases",
    slug: "pc-cases",
    description: "Airflow-first enclosures.",
    imageUrl: "/images/categories/pc-cases.png",
  },
] as const;
