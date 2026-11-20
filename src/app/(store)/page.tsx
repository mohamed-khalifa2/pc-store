import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import { getSiteContent } from "@/features/site-content/queries/get-site-content";
import { HomeJsonLd } from "@/features/home/components/HomeJsonLd";
import { HomeSectionRenderer } from "@/features/home/components/HomeSectionRenderer";
import { getHomePageData } from "@/features/home/queries/get-home-page-data";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();

  return {
    title: getSiteText(content, SITE_CONTENT_KEYS.homeTitle, SITE_NAME),
    description: getSiteText(content, SITE_CONTENT_KEYS.description, SITE_DESCRIPTION),
  };
}

export default async function HomePage() {
  const data = await getHomePageData();

  return (
    <>
      <HomeJsonLd content={data.content} />
      {data.sections.map((section) => (
        <HomeSectionRenderer
          key={section.id}
          section={section}
          banners={data.banners}
          categories={data.categories}
          products={data.products}
        />
      ))}
    </>
  );
}
