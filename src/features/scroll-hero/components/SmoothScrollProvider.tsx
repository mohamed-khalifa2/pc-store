"use client";

import { useEffect } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function SmoothScrollProvider() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ autoRaf: false, lerp: 0.1, respectReducedMotion: true });
      const update = () => ScrollTrigger.update();
      const tick = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.off("scroll", update);
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  return null;
}
