"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { Input } from "@/components/ui/Input";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { FormField } from "@/features/admin/components/FormField";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { initialAdminResult, type AdminActionResult } from "@/features/admin/lib/action-result";
import { upsertCategory } from "@/features/categories/actions/upsert-category";
import {
  CATEGORY_FORM_FIELDS as F,
  CATEGORY_IMAGE_PREFIX,
} from "@/features/categories/schemas/admin-category";
import type { AdminCategory } from "@/features/categories/types.admin";
import { STORAGE_BUCKETS } from "@/lib/constants";

const SELECT_CLASS =
  "bg-surface-900 border-surface-700 h-11 w-full rounded-md border px-4 text-sm text-white focus-visible:ring-accent";
const TEXTAREA_CLASS =
  "bg-surface-900 border-surface-700 min-h-28 w-full rounded-md border px-4 py-3 text-sm text-white focus-visible:ring-accent";

type CategoryFormState = AdminActionResult & { saved: boolean };

const initialState: CategoryFormState = { ...initialAdminResult, saved: false };

async function submitCategory(
  _previous: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const result: AdminActionResult = await upsertCategory(formData);
  return { ...result, saved: result.ok };
}

type CategoryFormProps = { categories: AdminCategory[]; category?: AdminCategory };

export function CategoryForm({ categories, category }: CategoryFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitCategory, initialState);
  const err = (field: string) => state.fieldErrors[field]?.[0];

  useEffect(() => {
    if (state.saved) router.push(ADMIN_ROUTES.categories);
  }, [state.saved, router]);

  const parentOptions = categories.filter((item) => item.id !== category?.id);

  return (
    <form action={formAction} className="space-y-6">
      {category ? <input type="hidden" name={F.id} value={category.id} readOnly /> : null}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="category-name" error={err(F.name)}>
          <Input
            id="category-name"
            name={F.name}
            defaultValue={category?.name ?? ""}
            autoComplete="off"
            required
          />
        </FormField>
        <FormField label="Slug" htmlFor="category-slug" error={err(F.slug)}>
          <Input
            id="category-slug"
            name={F.slug}
            defaultValue={category?.slug ?? ""}
            autoComplete="off"
            required
          />
        </FormField>
      </div>
      <FormField label="Description" htmlFor="category-description" error={err(F.description)}>
        <textarea
          id="category-description"
          name={F.description}
          defaultValue={category?.description ?? ""}
          className={TEXTAREA_CLASS}
        />
      </FormField>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Parent category" htmlFor="category-parent" error={err(F.parentId)}>
          <select
            id="category-parent"
            name={F.parentId}
            defaultValue={category?.parentId ?? ""}
            className={SELECT_CLASS}
          >
            <option value="">No parent</option>
            {parentOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Sort order" htmlFor="category-sort-order" error={err(F.sortOrder)}>
          <Input
            id="category-sort-order"
            name={F.sortOrder}
            type="number"
            min={0}
            max={9999}
            defaultValue={category?.sortOrder ?? 0}
            className="font-mono"
          />
        </FormField>
      </div>
      <ImageUploader
        name={F.imagePath}
        label="Category image"
        bucket={STORAGE_BUCKETS.siteAssets}
        prefix={CATEGORY_IMAGE_PREFIX}
        initialPaths={category?.imagePath ? [category.imagePath] : []}
        fallback="/images/categories/cpus.svg"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Visibility" error={err(F.isPublished)}>
          <label className="border-surface-700 flex h-11 items-center gap-3 rounded-md border px-4 text-sm font-bold">
            <input
              type="checkbox"
              name={F.isPublished}
              defaultChecked={category?.isPublished ?? false}
              className="border-surface-700 bg-surface-900 accent-accent h-5 w-5"
            />
            Published
          </label>
        </FormField>
        <FormField label="Publish at" htmlFor="category-published-at" error={err(F.publishedAt)}>
          <Input
            id="category-published-at"
            name={F.publishedAt}
            type="datetime-local"
            defaultValue={category?.publishedAt?.slice(0, 16) ?? ""}
          />
        </FormField>
      </div>
      <AdminSubmitButton label={ADMIN_COPY.save} pendingLabel={ADMIN_COPY.saving} />
      <AdminToast result={state} />
    </form>
  );
}
