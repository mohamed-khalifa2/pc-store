import { ROUTES } from "@/lib/constants";

export type HeroStep = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  range: readonly [number, number];
};

export const HERO_STEPS: readonly HeroStep[] = [
  {
    id: "power",
    eyebrow: "01 / Performance",
    title: "Built for",
    accent: "power",
    body: "Every case, board, and cooler is picked to hold serious performance.",
    range: [0, 0.36],
  },
  {
    id: "parts",
    eyebrow: "02 / Precision",
    title: "Every part,",
    accent: "chosen",
    body: "Explore the build layer by layer, from the frame to the final fan.",
    range: [0.34, 0.7],
  },
  {
    id: "ready",
    eyebrow: "03 / Delivery",
    title: "Ready to",
    accent: "ship",
    body: "Compatible parts, fast delivery, and support from actual builders.",
    ctaLabel: "Shop components",
    ctaHref: ROUTES.products,
    range: [0.68, 1],
  },
] as const;
