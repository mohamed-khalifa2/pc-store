"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent, type RefObject } from "react";

import { BLUR_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import {
  HERO_ARTWORK,
  HERO_ARTWORK_SIZES,
  HERO_TILT,
} from "@/features/scroll-hero/config/hero-artwork";

type HeroArtworkProps = {
  src?: string;
  alt?: string;
  imageRef?: RefObject<HTMLDivElement | null>;
  interactive?: boolean;
};

export function HeroArtwork({
  src = HERO_ARTWORK.src,
  alt = HERO_ARTWORK.alt,
  imageRef,
  interactive = false,
}: HeroArtworkProps) {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const writeTilt = (rotateX: number, rotateY: number) => {
    const element = tiltRef.current;
    if (!element) return;

    element.style.setProperty("--hero-rotate-x", `${rotateX.toFixed(2)}deg`);
    element.style.setProperty("--hero-rotate-y", `${rotateY.toFixed(2)}deg`);
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    boundsRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;

    const bounds = boundsRef.current;
    if (!bounds || !bounds.width || !bounds.height) return;

    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      writeTilt(-relativeY * HERO_TILT.maxDegrees, relativeX * HERO_TILT.maxDegrees);
      frameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (!interactive) return;
    boundsRef.current = null;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    writeTilt(0, 0);
  };

  return (
    <div
      ref={imageRef}
      data-hero-artwork
      className="relative mx-auto flex aspect-square w-full max-w-[30rem] items-center justify-center lg:max-w-[40rem]"
    >
      <div
        aria-hidden="true"
        className="bg-accent/10 absolute inset-[14%] rounded-full blur-[90px]"
      />
      <div
        ref={tiltRef}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(
          "relative w-full [--hero-rotate-x:0deg] [--hero-rotate-y:0deg]",
          "[transform:perspective(1200px)_rotateX(var(--hero-rotate-x))_rotateY(var(--hero-rotate-y))]",
          "ease-out-expo transition-transform duration-500 will-change-transform",
        )}
      >
        <div className="animate-hero-float relative aspect-[1338/1085] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={HERO_ARTWORK_SIZES}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            preload
            draggable={false}
            className="object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.65)]"
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="bg-black-950/80 absolute inset-x-[10%] bottom-[8%] h-8 rounded-[100%] blur-2xl"
      />
    </div>
  );
}
