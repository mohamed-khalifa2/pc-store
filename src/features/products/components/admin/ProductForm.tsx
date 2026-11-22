"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import type { AdminActionResult } from "@/features/admin/lib/action-result";
import { PRODUCT_CANCEL_CLASS } from "@/features/products/config/admin-product-form";
import {
  productFormSpecs,
  productFormValues,
} from "@/features/products/lib/admin-product-form-values";
import { upsertProduct } from "@/features/products/actions/upsert-product";
import { ProductCoreFields } from "@/features/products/components/admin/ProductCoreFields";
import { ProductPricingFields } from "@/features/products/components/admin/ProductPricingFields";
import { ProductVisibilityFields } from "@/features/products/components/admin/ProductVisibilityFields";
import { SpecsEditor } from "@/features/products/components/admin/SpecsEditor";
import {
  ADMIN_IMAGES_MAX,
  ADMIN_PRODUCT_FIELDS as F,
  type AdminCategoryOption,
} from "@/features/products/schemas/admin-product";
import type { AdminProductDetail } from "@/features/products/types.admin";
import { STORAGE_BUCKETS } from "@/lib/constants";

type UpsertState = AdminActionResult<{ id: string }>;

const INITIAL_STATE: UpsertState = { ok: true, error: null, fieldErrors: {} };

type ProductFormProps = {
  product?: AdminProductDetail;
  categories: readonly AdminCategoryOption[];
  prefix: string;
};

export function ProductForm({ product, categories, prefix }: ProductFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(upsertProduct, INITIAL_STATE);
  const values = productFormValues(product);

  useEffect(() => {
    if (!state.ok || !state.data?.id) return;
    if (product) router.refresh();
    else router.replace(ADMIN_ROUTES.product(state.data.id));
  }, [state, product, router]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name={F.id} value={product?.id ?? ""} readOnly />

      <AdminPanel title="Core details">
        <ProductCoreFields categories={categories} errors={state.fieldErrors} values={values} />
      </AdminPanel>

      <AdminPanel title="Pricing & inventory">
        <ProductPricingFields errors={state.fieldErrors} values={values} />
      </AdminPanel>

      <AdminPanel title="Visibility">
        <ProductVisibilityFields errors={state.fieldErrors} product={product} values={values} />
      </AdminPanel>

      <AdminPanel title="Specifications">
        <SpecsEditor
          initialSpecs={productFormSpecs(product)}
          error={state.fieldErrors.specs?.[0]}
        />
      </AdminPanel>

      <AdminPanel title="Images">
        <ImageUploader
          name={F.imagePaths}
          label="Product images"
          bucket={STORAGE_BUCKETS.productImages}
          prefix={prefix}
          initialPaths={product?.images.map((image) => image.storagePath) ?? []}
          multiple
          max={ADMIN_IMAGES_MAX}
        />
      </AdminPanel>

      <div className="flex flex-wrap items-center gap-3">
        <AdminSubmitButton
          label={product ? ADMIN_COPY.save : ADMIN_COPY.create}
          pendingLabel={ADMIN_COPY.saving}
        />
        <Link href={ADMIN_ROUTES.products} className={PRODUCT_CANCEL_CLASS}>
          {ADMIN_COPY.cancel}
        </Link>
      </div>
      <AdminToast result={state} />
    </form>
  );
}
