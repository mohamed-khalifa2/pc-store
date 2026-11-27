export type BundleDefinition = {
  id: string;
  slug: string;
  name: string;
  description: string;
  tag: string;
  discountPercent: number;
  productSlugs: readonly string[];
};

export const BUNDLE_DEFINITIONS: readonly BundleDefinition[] = [
  {
    id: "core-upgrade",
    slug: "core-upgrade",
    name: "The Core Upgrade",
    description: "A matched AM5 processor and flagship board for a clean platform upgrade.",
    tag: "Platform deal",
    discountPercent: 5,
    productSlugs: ["ryzen-7-9800x3d", "asus-rog-strix-x870e-e"],
  },
  {
    id: "visual-power",
    slug: "visual-power",
    name: "Visual Power Pair",
    description: "A high-end graphics card and showcase case for a serious visual upgrade.",
    tag: "GPU bundle",
    discountPercent: 4,
    productSlugs: ["rtx-5080", "lian-li-o11-dynamic-evo-xl"],
  },
  {
    id: "four-k-core",
    slug: "four-k-core",
    name: "4K Ready Core",
    description: "Processor, board, graphics, and case selected as a complete performance base.",
    tag: "Complete base",
    discountPercent: 7,
    productSlugs: [
      "ryzen-7-9800x3d",
      "asus-rog-strix-x870e-e",
      "rtx-5080",
      "lian-li-o11-dynamic-evo-xl",
    ],
  },
];

export const DEFAULT_BUNDLE_DEFINITIONS = BUNDLE_DEFINITIONS;
