import { SITE_NAME } from "@/lib/constants";

export type StaticPageSection = {
  heading: string;
  paragraphs: readonly string[];
  items?: readonly string[];
};

export type StaticPageDefinition = {
  eyebrow: string;
  title: string;
  description: string;
  updated?: string;
  sections: readonly StaticPageSection[];
};

export const STATIC_PAGES = {
  about: {
    eyebrow: "About us",
    title: `Built by people who build`,
    description: `${SITE_NAME} is a PC store for builders who care about performance, compatibility, and the details that make a machine feel complete.`,
    sections: [
      {
        heading: "Our story",
        paragraphs: [
          `We started ${SITE_NAME} to make upgrading a PC feel less like guesswork. Too many builds are held back by a mismatched part, unclear specs, or support that stops at checkout.`,
          "Our team selects components as complete build paths: processors, boards, graphics, cooling, cases, and the small pieces that keep everything running well together.",
        ],
      },
      {
        heading: "What we do",
        paragraphs: [
          "We stock performance-focused parts for gaming, creating, and everyday power users. Every listing is written to help you compare the details that matter, not just the headline numbers.",
        ],
        items: [
          "Curated CPUs, motherboards, GPUs, memory, storage, cooling, and cases",
          "Bundle suggestions built around compatible components",
          "Clear pricing in EGP and practical stock information",
          "Delivery and support across Egypt",
        ],
      },
      {
        heading: "Why builders choose us",
        paragraphs: [
          "We test compatibility, publish the information we would want before buying, and keep our catalog focused on parts we would use in our own builds.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Legal & policies",
    title: "Terms & policies",
    description:
      "These terms explain how this store works, what to expect from an order, and how we handle your information.",
    updated: "Last updated: November 2026",
    sections: [
      {
        heading: "Using the site",
        paragraphs: [
          "You may browse and purchase from this store for personal or business use. Please provide accurate contact and delivery details, and do not use the site for unlawful activity or to disrupt its operation.",
        ],
      },
      {
        heading: "Products and pricing",
        paragraphs: [
          "We work to keep product details, images, availability, and prices accurate. Specifications can change without notice, and a listing is an invitation to purchase rather than a guaranteed offer.",
          "All prices are shown in Egyptian pounds. Shipping costs, when applicable, are shown before an order is confirmed.",
        ],
      },
      {
        heading: "Orders and payment",
        paragraphs: [
          "An order is confirmed once payment is completed or, for cash on delivery, once our team confirms availability and delivery details. We may cancel or contact you about an order if a product is unavailable, priced incorrectly, or cannot be delivered.",
        ],
      },
      {
        heading: "Delivery",
        paragraphs: [
          "Delivery times depend on your governorate, stock availability, and courier schedules. We share tracking or contact details when an order moves to shipping.",
        ],
      },
      {
        heading: "Returns and support",
        paragraphs: [
          "If a product arrives damaged, faulty, or materially different from its listing, contact us with your order number and photos. We will review the issue and advise the appropriate return, replacement, or warranty path.",
          "Opened software, personal items, and products damaged by incorrect installation may not be eligible for return unless required by law.",
        ],
      },
      {
        heading: "Privacy",
        paragraphs: [
          "We use the information you provide to process orders, arrange delivery, and support your purchase. We do not sell your personal details. Payment credentials are handled by payment providers and are never stored by this store.",
        ],
      },
      {
        heading: "Changes and contact",
        paragraphs: [
          "We may update these policies as the store changes. The current version is always available on this page.",
          "For questions, email sales@example.com or call +20 100 000 0000.",
        ],
      },
    ],
  },
} as const satisfies Record<string, StaticPageDefinition>;

export type StaticPageKey = keyof typeof STATIC_PAGES;
