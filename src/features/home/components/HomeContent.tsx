import { HomeJsonLd } from "@/features/home/components/HomeJsonLd";
import { HomeSectionRenderer } from "@/features/home/components/HomeSectionRenderer";
import { getHomePageData } from "@/features/home/queries/get-home-page-data";

export async function HomeContent() {
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
          bundles={data.bundles}
          content={data.content}
        />
      ))}
    </>
  );
}
