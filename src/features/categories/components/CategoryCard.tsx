import Image from "next/image";
import Link from "next/link";

import { BLUR_PLACEHOLDER, ROUTES } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";

import type { CategoryCardData } from "@/features/categories/types";

type CategoryCardProps = {
  category: CategoryCardData;
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={ROUTES.category(category.slug)}
      className="group rounded-card border-surface-800 relative aspect-[4/3] overflow-hidden border"
    >
      <Image
        src={category.imageUrl}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        unoptimized={isRemoteUrl(category.imageUrl)}
        className="object-cover opacity-80 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
      <div className="from-black-950 via-black-950/20 absolute inset-0 bg-gradient-to-t to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-xl font-black text-white">{category.name}</h3>
        {category.description && (
          <p className="text-surface-200 mt-1 text-sm">{category.description}</p>
        )}
      </div>
    </Link>
  );
}
