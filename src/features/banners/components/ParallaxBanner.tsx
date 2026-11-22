"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";

import { BLUR_PLACEHOLDER } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";
import { cn } from "@/lib/utils/cn";

import type { Banner } from "@/features/banners/types";
import { useParallax } from "@/features/banners/hooks/useParallax";

type ParallaxBannerProps = {
  banner: Banner;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
};

export function ParallaxBanner({
  banner,
  children,
  className,
  contentClassName,
  overlayClassName,
}: ParallaxBannerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);

  useParallax({ rootRef, imageRef, textRef });

  return (
    <div ref={rootRef} className={cn("bg-black-900 relative overflow-hidden", className)}>
      <div ref={imageRef} className="absolute inset-x-0 -inset-y-12">
        <Image
          src={banner.imageUrl}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(banner.imageUrl)}
          className="hidden object-cover sm:block"
        />
        <Image
          src={banner.mobileImageUrl ?? banner.imageUrl}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(banner.mobileImageUrl ?? banner.imageUrl)}
          className="object-cover sm:hidden"
        />
      </div>
      <div
        className={cn(
          "from-black-950 via-black-950/70 to-accent/10 absolute inset-0 bg-gradient-to-r",
          overlayClassName,
        )}
      />
      <div ref={textRef} className={cn("relative z-10", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
