import { Container } from "@/components/ui/Container";

import { BannerCopy } from "@/features/banners/components/BannerCopy";
import { ParallaxBanner } from "@/features/banners/components/ParallaxBanner";
import type { Banner } from "@/features/banners/types";

type CategoryStripProps = {
  banner: Banner;
};

export function CategoryStrip({ banner }: CategoryStripProps) {
  return (
    <ParallaxBanner
      banner={banner}
      className="min-h-[24rem]"
      overlayClassName="from-black-950 via-black-950/60 to-accent-strong/20"
      contentClassName="flex min-h-[24rem] items-end"
    >
      <Container className="py-12">
        <BannerCopy banner={banner} eyebrow="Category spotlight" />
      </Container>
    </ParallaxBanner>
  );
}
