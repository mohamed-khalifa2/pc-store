export const BUNDLE_COPY = {
  eyebrow: "Curated combos",
  title: "Bundles that work together",
  description:
    "Compatible parts, priced as a set. Pick a ready-made pairing and skip the guesswork.",
  homeTitle: "Ready-made bundles",
  homeDescription:
    "Matched components that land well together, with the bundle saving already applied.",
  viewAll: "View all bundles",
  explore: "Explore bundle",
  includes: "Includes",
  moreItems: (count: number) => `+${count} more`,
  available: "Available",
  limited: "Limited stock",
  save: (amount: string) => `Save ${amount}`,
  bundleTotal: "Bundle total",
} as const;
