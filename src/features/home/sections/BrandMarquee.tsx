import { Section } from "@/components/ui/Section";

import { DEFAULT_BRAND_ITEMS } from "@/features/home/config/brand-items";
import type { HomeSection } from "@/features/home/types";

type BrandMarqueeProps = {
  section: HomeSection;
};

export function BrandMarquee({ section }: BrandMarqueeProps) {
  const items = section.config.items?.length ? section.config.items : DEFAULT_BRAND_ITEMS;

  return (
    <Section spacing="tight" className="border-surface-800 bg-black-900 overflow-hidden border-y">
      <div aria-label={section.title ?? "Featured brands"} className="animate-marquee flex w-max">
        {[0, 1].map((group) => (
          <div key={group} aria-hidden={group === 1} className="flex shrink-0 gap-12 pr-12">
            {items.map((item) => (
              <span
                key={`${group}-${item}`}
                className="text-surface-400 text-lg font-black tracking-[0.2em] uppercase"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
