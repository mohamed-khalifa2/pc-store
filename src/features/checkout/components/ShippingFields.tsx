"use client";

import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { EGYPT_GOVERNORATES } from "@/features/checkout/config/governorates";
import { CheckoutField } from "@/features/checkout/components/CheckoutField";
import type { CheckoutFieldErrors } from "@/features/checkout/lib/field-errors";
import { CHECKOUT_FIELDS } from "@/lib/constants";

const GOVERNORATE_LIST_ID = "governorate-options";

export function ShippingFields({ fieldErrors }: { fieldErrors: CheckoutFieldErrors }) {
  return (
    <fieldset className="border-surface-800 bg-surface-900/40 rounded-card border p-6 sm:p-8">
      <legend className="text-accent px-2 text-xs font-black tracking-[0.35em] uppercase">
        {CHECKOUT_COPY.fieldsLegend}
      </legend>
      <div className="grid gap-5 sm:grid-cols-2">
        <CheckoutField
          id={CHECKOUT_FIELDS.fullName}
          name={CHECKOUT_FIELDS.fullName}
          label={CHECKOUT_COPY.fullNameLabel}
          autoComplete="name"
          errors={fieldErrors[CHECKOUT_FIELDS.fullName]}
        />
        <CheckoutField
          id={CHECKOUT_FIELDS.phone}
          name={CHECKOUT_FIELDS.phone}
          label={CHECKOUT_COPY.phoneLabel}
          type="tel"
          autoComplete="tel"
          errors={fieldErrors[CHECKOUT_FIELDS.phone]}
        />
        <CheckoutField
          id={CHECKOUT_FIELDS.governorate}
          name={CHECKOUT_FIELDS.governorate}
          label={CHECKOUT_COPY.governorateLabel}
          list={GOVERNORATE_LIST_ID}
          errors={fieldErrors[CHECKOUT_FIELDS.governorate]}
        />
        <CheckoutField
          id={CHECKOUT_FIELDS.city}
          name={CHECKOUT_FIELDS.city}
          label={CHECKOUT_COPY.cityLabel}
          autoComplete="address-level2"
          errors={fieldErrors[CHECKOUT_FIELDS.city]}
        />
        <div className="sm:col-span-2">
          <CheckoutField
            id={CHECKOUT_FIELDS.address}
            name={CHECKOUT_FIELDS.address}
            label={CHECKOUT_COPY.addressLabel}
            autoComplete="street-address"
            errors={fieldErrors[CHECKOUT_FIELDS.address]}
          />
        </div>
        <div className="sm:col-span-2">
          <CheckoutField
            id={CHECKOUT_FIELDS.notes}
            name={CHECKOUT_FIELDS.notes}
            label={CHECKOUT_COPY.notesLabel}
            required={false}
            errors={fieldErrors[CHECKOUT_FIELDS.notes]}
          />
        </div>
      </div>
      <datalist id={GOVERNORATE_LIST_ID}>
        {EGYPT_GOVERNORATES.map((governorate) => (
          <option key={governorate} value={governorate} />
        ))}
      </datalist>
    </fieldset>
  );
}
