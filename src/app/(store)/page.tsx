import type { Metadata } from "next";
import { Suspense } from "react";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

import { HomeContent } from "@/features/home/components/HomeContent";
import { HomeSkeleton } from "@/features/home/components/HomeSkeleton";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import { getSiteContent } from "@/features/site-content/queries/get-site-content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  const genericTitle = getSiteText(content, SITE_CONTENT_KEYS.seoTitle, SITE_NAME);
  const genericDescription = getSiteText(
    content,
    SITE_CONTENT_KEYS.seoDescription,
    SITE_DESCRIPTION,
  );

  return {
    title: getSiteText(content, SITE_CONTENT_KEYS.homeTitle, genericTitle),
    description: getSiteText(content, SITE_CONTENT_KEYS.description, genericDescription),
  };
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
