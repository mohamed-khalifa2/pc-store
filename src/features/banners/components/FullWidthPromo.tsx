import { Container } from "@/components/ui/Container";

import { BannerCopy } from "@/features/banners/components/BannerCopy";
import { ParallaxBanner } from "@/features/banners/components/ParallaxBanner";
import type { Banner } from "@/features/banners/types";

type FullWidthPromoProps = {
  banner: Banner;
};

export function FullWidthPromo({ banner }: FullWidthPromoProps) {
  return (
    <ParallaxBanner
      banner={banner}
      className="min-h-[32rem]"
      contentClassName="flex min-h-[32rem] items-center"
    >
      <Container>
        <BannerCopy banner={banner} eyebrow="Limited drop" size="display" />
      </Container>
    </ParallaxBanner>
  );
}
