import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import { getSiteText } from "@/features/site-content/lib/get-site-text";
import type { SiteContent } from "@/features/site-content/types";

import { HERO_STEPS, type HeroStep } from "@/features/scroll-hero/config/steps";

const STEP_KEYS = [
  {
    eyebrow: SITE_CONTENT_KEYS.step1Eyebrow,
    title: SITE_CONTENT_KEYS.step1Title,
    accent: SITE_CONTENT_KEYS.step1Accent,
    body: SITE_CONTENT_KEYS.step1Body,
    cta: undefined,
  },
  {
    eyebrow: SITE_CONTENT_KEYS.step2Eyebrow,
    title: SITE_CONTENT_KEYS.step2Title,
    accent: SITE_CONTENT_KEYS.step2Accent,
    body: SITE_CONTENT_KEYS.step2Body,
    cta: undefined,
  },
  {
    eyebrow: SITE_CONTENT_KEYS.step3Eyebrow,
    title: SITE_CONTENT_KEYS.step3Title,
    accent: SITE_CONTENT_KEYS.step3Accent,
    body: SITE_CONTENT_KEYS.step3Body,
    cta: SITE_CONTENT_KEYS.step3Cta,
  },
] as const;

export function getHeroSteps(content: SiteContent): HeroStep[] {
  return HERO_STEPS.map((step, index) => {
    const keys = STEP_KEYS[index]!;
    return {
      ...step,
      eyebrow: getSiteText(content, keys.eyebrow, step.eyebrow),
      title: getSiteText(content, keys.title, step.title),
      accent: getSiteText(content, keys.accent, step.accent),
      body: getSiteText(content, keys.body, step.body),
      ctaLabel: keys.cta ? getSiteText(content, keys.cta, step.ctaLabel ?? "") : step.ctaLabel,
    };
  });
}
