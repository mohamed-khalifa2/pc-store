import { FormField } from "@/features/admin/components/FormField";
import type { AdminFieldErrors } from "@/features/admin/lib/action-result";
import {
  PRODUCT_CHECKBOX_CLASS,
  PRODUCT_INPUT_CLASS,
  PRODUCT_TOGGLES,
} from "@/features/products/config/admin-product-form";
import type { ProductFormValues } from "@/features/products/lib/admin-product-form-values";
import { ADMIN_PRODUCT_FIELDS as F } from "@/features/products/schemas/admin-product";
import type { AdminProductDetail } from "@/features/products/types.admin";

type ProductVisibilityFieldsProps = {
  errors: AdminFieldErrors;
  product?: AdminProductDetail;
  values: ProductFormValues;
};

export function ProductVisibilityFields({ errors, product, values }: ProductVisibilityFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {PRODUCT_TOGGLES.map((toggle) => (
        <label
          key={toggle.key}
          htmlFor={toggle.id}
          className="flex items-center gap-3 text-sm text-white"
        >
          <input
            id={toggle.id}
            type="checkbox"
            name={toggle.key}
            value="on"
            defaultChecked={
              toggle.key === F.isPublished
                ? (product?.isPublished ?? false)
                : (product?.isFeatured ?? false)
            }
            className={PRODUCT_CHECKBOX_CLASS}
          />
          {toggle.label}
        </label>
      ))}
      <FormField
        label="Published at"
        htmlFor="product-published-at"
        error={errors.publishedAt?.[0]}
      >
        <input
          id="product-published-at"
          type="datetime-local"
          name={F.publishedAt}
          defaultValue={values[F.publishedAt]}
          className={PRODUCT_INPUT_CLASS}
        />
      </FormField>
    </div>
  );
}
