"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/Input";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { FormField } from "@/features/admin/components/FormField";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { initialAdminResult, type AdminActionResult } from "@/features/admin/lib/action-result";
import { HERO_ARTWORK, HERO_IMAGE_PREFIX } from "@/features/scroll-hero/config/hero-artwork";
import { updateSiteContent } from "@/features/site-content/actions/update-site-content";
import { SITE_CONTENT_KEYS } from "@/features/site-content/config/keys";
import type { AdminSiteContentEntry } from "@/features/site-content/types.admin";
import { STORAGE_BUCKETS } from "@/lib/constants";

const IMAGE_KEY = SITE_CONTENT_KEYS.heroImage;
const ALT_KEY = SITE_CONTENT_KEYS.heroImageAlt;
const CONTENT_KEYS = JSON.stringify([IMAGE_KEY, ALT_KEY]);

type HeroArtworkFormProps = {
  entries: readonly AdminSiteContentEntry[];
};

function stringValue(entries: readonly AdminSiteContentEntry[], key: string): string | null {
  const value = entries.find((entry) => entry.key === key)?.value;
  return typeof value === "string" && value.trim() ? value : null;
}

export function HeroArtworkForm({ entries }: HeroArtworkFormProps) {
  const [state, formAction] = useActionState<AdminActionResult, FormData>(
    (_previous, formData) => updateSiteContent(formData),
    initialAdminResult,
  );

  const storedPath = stringValue(entries, IMAGE_KEY);
  const initialPaths = storedPath?.startsWith(`${HERO_IMAGE_PREFIX}/`) ? [storedPath] : [];
  const altValue = stringValue(entries, ALT_KEY) ?? HERO_ARTWORK.alt;

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <input type="hidden" name="contentKeys" value={CONTENT_KEYS} readOnly />
      <FormField
        label="Hero artwork"
        hint="Use a transparent PNG. The default artwork stays live until you upload a replacement."
        error={state.fieldErrors[IMAGE_KEY]?.[0]}
      >
        <ImageUploader
          name={`value.${IMAGE_KEY}`}
          label="Storefront hero image"
          bucket={STORAGE_BUCKETS.siteAssets}
          prefix={HERO_IMAGE_PREFIX}
          initialPaths={initialPaths}
          fallback={HERO_ARTWORK.src}
          fit="contain"
        />
      </FormField>
      <input type="hidden" name={`value.${IMAGE_KEY}`} value={HERO_ARTWORK.src} readOnly />
      <FormField
        label="Image description"
        hint="Describe the artwork for screen readers."
        htmlFor="hero-image-alt"
        error={state.fieldErrors[ALT_KEY]?.[0]}
      >
        <Input
          id="hero-image-alt"
          name={`value.${ALT_KEY}`}
          defaultValue={altValue}
          maxLength={160}
          required
        />
      </FormField>
      <div className="flex justify-end lg:col-span-2">
        <AdminSubmitButton
          label="Save hero artwork"
          pendingLabel={ADMIN_COPY.saving}
          size="sm"
          variant="secondary"
        />
      </div>
      <AdminToast result={state} />
    </form>
  );
}
