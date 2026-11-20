"use client";

import { useEffect, type RefObject } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type ParallaxRefs = {
  rootRef: RefObject<HTMLDivElement | null>;
  imageRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLDivElement | null>;
};

export function useParallax({ rootRef, imageRef, textRef }: ParallaxRefs) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    if (reducedMotion || !root || !image || !text) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

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
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  onToggle: (self) => {
                    root.classList.toggle("will-change-transform", self.isActive);
                    image.classList.toggle("will-change-transform", self.isActive);
                  },
                },
              })
              .fromTo(image, { yPercent: -8 }, { yPercent: 8, ease: "none" }, 0)
              .fromTo(text, { y: 32, autoAlpha: 0.65 }, { y: -16, autoAlpha: 1, ease: "none" }, 0);
          }, root);

          cleanup = () => {
            context.revert();
            root.classList.remove("will-change-transform");
            image.classList.remove("will-change-transform");
          };
        })();
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(root);

    return () => {
      disposed = true;
      observer.disconnect();
      cleanup?.();
    };
  }, [reducedMotion, rootRef, imageRef, textRef]);
}
