import { Container } from "@/components/ui/Container";

import { BannerCopy } from "@/features/banners/components/BannerCopy";
import { ParallaxBanner } from "@/features/banners/components/ParallaxBanner";
import type { Banner } from "@/features/banners/types";

type SplitBannerProps = {
  banner: Banner;
};

export function SplitBanner({ banner }: SplitBannerProps) {
  return (
    <ParallaxBanner
      banner={banner}
      className="min-h-[34rem]"
      overlayClassName="from-black-950/20 via-black-950/30 to-black-950/85"
      contentClassName="flex min-h-[34rem] items-center"
    >
      <Container className="grid w-full gap-8 md:grid-cols-2">
        <div aria-hidden="true" className="hidden md:block" />
        <div className="rounded-card border-surface-700 bg-black-950/85 p-8 backdrop-blur md:p-12">
          <BannerCopy banner={banner} eyebrow="Split feature" />
        </div>
      </Container>
    </ParallaxBanner>
  );
}
