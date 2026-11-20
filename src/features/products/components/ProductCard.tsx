import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { BLUR_PLACEHOLDER, ROUTES } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";
import { formatEgp } from "@/lib/format/currency";

import type { ProductCardData } from "@/features/products/types";

type ProductCardProps = {
  product: ProductCardData;
};

export function ProductCard({ product }: ProductCardProps) {
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.priceEgp;

  return (
    <Link
      href={ROUTES.product(product.slug)}
      className="rounded-card border-surface-800 bg-surface-900/60 group block border p-4 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="bg-black-900 relative aspect-[4/3] overflow-hidden rounded-xl">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(product.imageUrl)}
          className="object-cover opacity-85 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        {onSale && <Badge className="absolute top-3 left-3">Sale</Badge>}
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-base font-black text-white">{product.name}</h3>
        {product.description && (
          <p className="text-surface-400 line-clamp-2 text-sm leading-relaxed">
            {product.description}
          </p>
        )}
        <div className="flex items-baseline gap-3">
          <span className="text-accent text-lg font-black">{formatEgp(product.priceEgp)}</span>
          {onSale && product.compareAtPrice !== null && (
            <s className="text-surface-400 text-sm">{formatEgp(product.compareAtPrice)}</s>
          )}
        </div>
        <p className="text-surface-400 text-xs font-bold tracking-[0.14em] uppercase">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>
    </Link>
  );
}
