import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";

import type { Banner } from "@/features/banners/types";

type BannerCopyProps = {
  banner: Banner;
  eyebrow?: string;
  size?: "section" | "display";
};

export function BannerCopy({
  banner,
  eyebrow = "Featured drop",
  size = "section",
}: BannerCopyProps) {
  return (
    <div className="max-w-2xl space-y-5">
      <Badge>{eyebrow}</Badge>
      <Heading level={2} size={size} className="text-balance">
        {banner.headline}
      </Heading>
      {banner.subheadline && (
        <p className="text-surface-200 text-base leading-relaxed sm:text-lg">
          {banner.subheadline}
        </p>
      )}
      {banner.ctaLabel && banner.ctaHref && (
        <LinkButton href={banner.ctaHref} size="lg">
          {banner.ctaLabel}
        </LinkButton>
      )}
    </div>
  );
}
