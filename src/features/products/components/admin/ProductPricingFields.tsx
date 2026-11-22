import { FormField } from "@/features/admin/components/FormField";
import type { AdminFieldErrors } from "@/features/admin/lib/action-result";
import {
  PRODUCT_INPUT_CLASS,
  PRODUCT_NUMBER_FIELDS,
} from "@/features/products/config/admin-product-form";
import type { ProductFormValues } from "@/features/products/lib/admin-product-form-values";

type ProductPricingFieldsProps = {
  errors: AdminFieldErrors;
  values: ProductFormValues;
};

export function ProductPricingFields({ errors, values }: ProductPricingFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PRODUCT_NUMBER_FIELDS.map((field) => (
        <FormField
          key={field.key}
          label={field.label}
          htmlFor={field.id}
          error={errors[field.key]?.[0]}
        >
          <input
            id={field.id}
            type="number"
            step={field.step}
            min={field.required ? 0 : undefined}
            name={field.key}
            defaultValue={values[field.key]}
            className={PRODUCT_INPUT_CLASS}
            required={field.required}
          />
        </FormField>
      ))}
    </div>
  );
}
