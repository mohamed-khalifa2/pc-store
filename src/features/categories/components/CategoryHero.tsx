import Image from "next/image";

import { Heading } from "@/components/ui/Heading";
import { BLUR_PLACEHOLDER } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";

import { CATEGORY_COPY } from "@/features/categories/config/copy";
import type { CategoryDetailData } from "@/features/categories/types";

type CategoryHeroProps = {
  category: CategoryDetailData;
};

export function CategoryHero({ category }: CategoryHeroProps) {
  return (
    <section className="border-surface-800 relative overflow-hidden border-b">
      <div className="relative h-64 sm:h-80">
        <Image
          src={category.imageUrl}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(category.imageUrl)}
          className="object-contain p-8 opacity-60"
        />
        <div className="from-black-950 via-black-950/70 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>
      <div className="max-w-container-store relative mx-auto -mt-40 w-full px-5 pb-10 sm:px-8 lg:px-12">
        <p className="text-accent text-xs font-black tracking-[0.35em] uppercase">
          {CATEGORY_COPY.heroEyebrow}
        </p>
        <Heading level={1} className="mt-3">
          {category.name}
        </Heading>
        {category.description && (
          <p className="text-surface-200 mt-4 max-w-2xl">{category.description}</p>
        )}
      </div>
    </section>
  );
}
