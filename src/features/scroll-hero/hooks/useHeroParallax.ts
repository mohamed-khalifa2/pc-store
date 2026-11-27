"use client";

import { useEffect, type RefObject } from "react";

type HeroParallaxOptions = {
  rootRef: RefObject<HTMLElement | null>;
  imageRef: RefObject<HTMLElement | null>;
  glowRef: RefObject<HTMLElement | null>;
  copyRef: RefObject<HTMLElement | null>;
  enabled: boolean;
};

export function useHeroParallax({
  rootRef,
  imageRef,
  glowRef,
  copyRef,
  enabled,
}: HeroParallaxOptions) {
  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    const glow = glowRef.current;
    const copy = copyRef.current;
    if (!enabled || !root || !image || !glow || !copy) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;
    const layers = [root, image, glow, copy];

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root,
              start: "clamp(top bottom)",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
              onToggle: (self) => {
                layers.forEach((layer) => {
                  layer.classList.toggle("will-change-transform", self.isActive);
                });
              },
            },
          })
          .fromTo(image, { yPercent: -6 }, { yPercent: 12, scale: 1.06, ease: "none" }, 0)
          .fromTo(
            glow,
            { yPercent: -14, xPercent: -4 },
            { yPercent: 18, xPercent: 5, ease: "none" },
            0,
          )
          .fromTo(copy, { y: 0, autoAlpha: 1 }, { y: -48, autoAlpha: 0.25, ease: "none" }, 0);
      }, root);

      cleanup = () => {
        context.revert();
        layers.forEach((layer) => layer.classList.remove("will-change-transform"));
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [copyRef, enabled, glowRef, imageRef, rootRef]);
}
