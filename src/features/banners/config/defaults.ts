import { ROUTES } from "@/lib/constants";

import type { Banner } from "@/features/banners/types";

export const DEFAULT_BANNERS: readonly Banner[] = [
  {
    id: "default-build-week",
    name: "Build Week",
    headline: "Build week is live",
    subheadline: "Upgrade your rig with tuned component bundles.",
    ctaLabel: "Shop bundles",
    ctaHref: ROUTES.products,
    imageUrl: "/images/banners/build-week.svg",
    mobileImageUrl: "/images/banners/build-week.svg",
    variant: "full",
  },
  {
    id: "default-gpu-drop",
    name: "GPU Drop",
    headline: "Next-gen GPUs landed",
    subheadline: "Find the right card for 1440p and 4K.",
    ctaLabel: "Browse GPUs",
    ctaHref: ROUTES.category("graphics-cards"),
    imageUrl: "/images/banners/gpu-drop.svg",
    mobileImageUrl: "/images/banners/gpu-drop.svg",
    variant: "split",
  },
  {
    id: "default-category-strip",
    name: "Category Strip",
    headline: "Every part. One place.",
    subheadline: "From the first fan to the final cable.",
    ctaLabel: "Browse categories",
    ctaHref: ROUTES.categories,
    imageUrl: "/images/banners/category-strip.svg",
    mobileImageUrl: "/images/banners/category-strip.svg",
    variant: "strip",
  },
] as const;
