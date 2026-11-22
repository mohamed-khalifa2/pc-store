"use client";

import Image from "next/image";
import { useState } from "react";

import { BLUR_PLACEHOLDER } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";
import { cn } from "@/lib/utils/cn";

import type { ProductImageData } from "@/features/products/types";

type ProductGalleryProps = {
  images: ProductImageData[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="border-surface-800 bg-black-900 rounded-card relative aspect-square overflow-hidden border">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt || name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(active.url)}
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative size-20 overflow-hidden rounded-md border",
                index === activeIndex ? "border-accent" : "border-surface-700",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="80px"
                placeholder="blur"
                blurDataURL={BLUR_PLACEHOLDER}
                unoptimized={isRemoteUrl(image.url)}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
