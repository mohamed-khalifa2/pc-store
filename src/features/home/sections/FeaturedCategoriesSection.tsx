import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { BLUR_PLACEHOLDER, ROUTES } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";

import type { CategoryCardData } from "@/features/categories/types";
import type { HomeSection } from "@/features/home/types";

type FeaturedCategoriesSectionProps = {
  section: HomeSection;
  categories: CategoryCardData[];
};

export function FeaturedCategoriesSection({ section, categories }: FeaturedCategoriesSectionProps) {
  if (categories.length === 0) return null;

  return (
    <Section className="border-surface-800 border-b">
      <Container className="space-y-10">
        <div className="space-y-3">
          <Heading level={2}>{section.title ?? "Shop by category"}</Heading>
          {section.subtitle && <p className="text-surface-400 text-lg">{section.subtitle}</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={ROUTES.category(category.slug)}
              className="group rounded-card border-surface-800 bg-surface-900 relative aspect-[4/3] overflow-hidden border"
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
                  <p className="text-surface-300 mt-1 text-sm">{category.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
