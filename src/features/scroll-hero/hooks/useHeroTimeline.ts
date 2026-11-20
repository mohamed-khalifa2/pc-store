"use client";

import { useEffect, type RefObject } from "react";

import { HERO_PARTS, type HeroTransform } from "@/features/scroll-hero/config/parts";
import { HERO_STEPS } from "@/features/scroll-hero/config/steps";

type HeroTimelineOptions = {
  rootRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  enabled: boolean;
};

function toGsapVars(transform: HeroTransform) {
  const { opacity, ...rest } = transform;
  return { ...rest, autoAlpha: opacity };
}

export function useHeroTimeline({ rootRef, stageRef, enabled }: HeroTimelineOptions) {
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

      const buildTimeline = (isMobile: boolean) => {
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
            onToggle: (self) => {
              stage.querySelectorAll("[data-hero-part]").forEach((element) => {
                element.classList.toggle("will-change-transform", self.isActive);
              });
            },
          },
        });

        timeline.to({}, { duration: 1 }, 0);

        HERO_PARTS.filter((part) => !isMobile || part.mobile).forEach((part) => {
          const element = stage.querySelector<HTMLElement>(`[data-hero-part="${part.id}"]`);
          if (!element) return;

          gsap.set(element, { x: 0, y: 0, z: 0, rotation: 0, scale: 1, autoAlpha: 1 });
          const [explodeStart, explodeEnd] = part.range;
          timeline
            .to(element, { ...toGsapVars(part.start), duration: Math.max(explodeStart, 0.01) }, 0)
            .to(
              element,
              {
                ...toGsapVars(part.end),
                duration: Math.max(explodeEnd - explodeStart, 0.01),
              },
              explodeStart,
            );
        });

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

      const media = gsap.matchMedia();
      media.add("(min-width: 768px)", () => buildTimeline(false));
      media.add("(max-width: 767px)", () => buildTimeline(true));
      revertMatchMedia = () => media.revert();
    })();

    return () => {
      disposed = true;
      revertMatchMedia?.();
      stage.querySelectorAll("[data-hero-part]").forEach((element) => {
        element.classList.remove("will-change-transform");
      });
    };
  }, [enabled, rootRef, stageRef]);
}
