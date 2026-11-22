import { FormField } from "@/features/admin/components/FormField";
import type { AdminFieldErrors } from "@/features/admin/lib/action-result";
import {
  PRODUCT_CORE_FIELDS,
  PRODUCT_INPUT_CLASS,
} from "@/features/products/config/admin-product-form";
import {
  ADMIN_PRODUCT_FIELDS as F,
  type AdminCategoryOption,
} from "@/features/products/schemas/admin-product";
import type { ProductFormValues } from "@/features/products/lib/admin-product-form-values";

type ProductCoreFieldsProps = {
  categories: readonly AdminCategoryOption[];
  errors: AdminFieldErrors;
  values: ProductFormValues;
};

export function ProductCoreFields({ categories, errors, values }: ProductCoreFieldsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {PRODUCT_CORE_FIELDS.map((field) => (
        <FormField
          key={field.key}
          label={field.label}
          htmlFor={field.id}
          error={errors[field.key]?.[0]}
        >
          {field.key === F.description ? (
            <textarea
              id={field.id}
              name={field.key}
              rows={4}
              defaultValue={values[field.key]}
              className={`${PRODUCT_INPUT_CLASS} min-h-24 py-3`}
            />
          ) : (
            <input
              id={field.id}
              name={field.key}
              defaultValue={values[field.key]}
              className={PRODUCT_INPUT_CLASS}
              required
            />
          )}
        </FormField>
      ))}
      <FormField label="Category" htmlFor="product-category-id" error={errors.categoryId?.[0]}>
        <select
          id="product-category-id"
          name={F.categoryId}
          defaultValue={values[F.categoryId]}
          className={PRODUCT_INPUT_CLASS}
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>
    </div>
  );
}
