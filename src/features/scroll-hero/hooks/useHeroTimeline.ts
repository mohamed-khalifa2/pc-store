"use client";

import { useEffect, type RefObject } from "react";

import { HERO_STEPS } from "@/features/scroll-hero/config/steps";
import type { HeroRuntime } from "@/features/scroll-hero/lib/hero-runtime";

type HeroTimelineOptions = {
  rootRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  runtime: HeroRuntime;
  enabled: boolean;
};

export function useHeroTimeline({ rootRef, stageRef, runtime, enabled }: HeroTimelineOptions) {
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!enabled || !root || !stage) return;

    let disposed = false;
    let revertMatchMedia: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);

      const buildTimeline = () => {
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            pin: stage,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => runtime.setProgress(self.progress),
            onRefresh: (self) => runtime.setProgress(self.progress),
          },
        });

        timeline.to({}, { duration: 1 }, 0);

        HERO_STEPS.forEach((step, index) => {
          const element = stage.querySelector<HTMLElement>(`[data-hero-step="${step.id}"]`);
          if (!element) return;

          const [visibleStart, visibleEnd] = step.range;
          gsap.set(element, index === 0 ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 32 });

          if (index > 0) {
            timeline.to(
              element,
              { autoAlpha: 1, y: 0, duration: Math.min(0.12, visibleEnd - visibleStart) },
              visibleStart,
            );
          }

          if (index < HERO_STEPS.length - 1) {
            timeline.to(element, { autoAlpha: 0, y: -24, duration: 0.08 }, visibleEnd);
          }
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      };

      revertMatchMedia = buildTimeline();
    })();

    return () => {
      disposed = true;
      revertMatchMedia?.();
      runtime.setProgress(0);
    };
  }, [enabled, rootRef, runtime, stageRef]);
}
