import { buildHomeJsonLd } from "@/features/home/lib/json-ld";
import type { SiteContent } from "@/features/site-content/types";

type HomeJsonLdProps = {
  content: SiteContent;
};

export function HomeJsonLd({ content }: HomeJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildHomeJsonLd(content) }}
    />
  );
}
