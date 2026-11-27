import type { Metadata } from "next";

import { StaticPageView } from "@/features/site-content/components/StaticPageView";
import { STATIC_PAGES } from "@/features/site-content/config/static-pages";

const page = STATIC_PAGES.about;

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
};

export default function AboutPage() {
  return <StaticPageView page={page} />;
}
