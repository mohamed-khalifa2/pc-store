import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { ArrowUpRightIcon } from "@/components/ui/icons/ArrowUpRightIcon";
import { BLUR_PLACEHOLDER, ROUTES } from "@/lib/constants";
import { formatEgp } from "@/lib/format/currency";
import { isRemoteUrl } from "@/lib/format/asset-url";

import { BUNDLE_COPY } from "@/features/bundles/config/copy";
import type { Bundle } from "@/features/bundles/types";

const VISIBLE_PRODUCTS = 3;

type BundleCardProps = {
  bundle: Bundle;
  headingLevel?: 2 | 3;
};

export function BundleCard({ bundle, headingLevel = 3 }: BundleCardProps) {
  const primary = bundle.products[0]!;
  const visibleNames = bundle.products.slice(0, VISIBLE_PRODUCTS).map((product) => product.name);
  const hiddenCount = bundle.products.length - visibleNames.length;

  return (
    <Link
      href={ROUTES.bundles}
      className="rounded-card border-surface-800 bg-surface-900/60 group hover:border-accent-strong hover:shadow-card-hover block border p-4 transition-[transform,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <div className="bg-black-900 relative aspect-[16/10] overflow-hidden rounded-xl">
        <Image
          src={primary.imageUrl}
          alt={primary.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(primary.imageUrl)}
          className="object-cover opacity-85 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <div
          aria-hidden="true"
          className="from-black-950/80 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent opacity-70"
        />
        <Badge className="absolute top-3 left-3">{bundle.tag}</Badge>
        <span className="bg-accent text-black-950 absolute right-3 bottom-3 rounded-full px-3 py-1 text-xs font-black">
          -{bundle.discountPercent}%
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Heading level={headingLevel} size="card">
            {bundle.name}
          </Heading>
          <span className="text-accent">
            <ArrowUpRightIcon />
          </span>
        </div>
        <p className="text-surface-400 line-clamp-2 text-sm leading-relaxed">
          {bundle.description}
        </p>

        <div className="text-surface-300 space-y-1 text-xs">
          <p className="text-surface-400 font-black tracking-[0.14em] uppercase">
            {BUNDLE_COPY.includes}
          </p>
          {visibleNames.map((name) => (
            <p key={name} className="truncate">
              {name}
            </p>
          ))}
          {hiddenCount > 0 && <p className="text-accent">{BUNDLE_COPY.moreItems(hiddenCount)}</p>}
        </div>

        <div className="border-surface-800 flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-surface-400 text-[0.65rem] font-black tracking-[0.14em] uppercase">
              {BUNDLE_COPY.bundleTotal}
            </p>
            <p className="text-accent text-lg font-black">{formatEgp(bundle.priceEgp)}</p>
            <p className="text-surface-400 text-xs">
              <s>{formatEgp(bundle.originalPriceEgp)}</s> ·{" "}
              {BUNDLE_COPY.save(formatEgp(bundle.savingsEgp))}
            </p>
          </div>
          <p className="text-surface-400 text-xs font-bold">
            {bundle.available ? BUNDLE_COPY.available : BUNDLE_COPY.limited}
          </p>
        </div>
      </div>
    </Link>
  );
}
