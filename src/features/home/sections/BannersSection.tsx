import { CategoryStrip } from "@/features/banners/components/CategoryStrip";
import { FullWidthPromo } from "@/features/banners/components/FullWidthPromo";
import { SplitBanner } from "@/features/banners/components/SplitBanner";
import type { Banner } from "@/features/banners/types";
import type { HomeSection } from "@/features/home/types";

type BannersSectionProps = {
  section: HomeSection;
  banners: Banner[];
};

export function BannersSection({ section, banners }: BannersSectionProps) {
  if (banners.length === 0) return null;

  return (
    <section aria-labelledby="banners-heading" className="space-y-4">
      <h2 id="banners-heading" className="sr-only">
        {section.title ?? "Latest drops"}
      </h2>
      {banners.map((banner) => {
        if (banner.variant === "split") return <SplitBanner key={banner.id} banner={banner} />;
        if (banner.variant === "strip") return <CategoryStrip key={banner.id} banner={banner} />;
        return <FullWidthPromo key={banner.id} banner={banner} />;
      })}
    </section>
  );
}
