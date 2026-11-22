"use client";

import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { PAYMENT_OPTIONS } from "@/features/checkout/config/payment-options";
import { CHECKOUT_FIELDS } from "@/lib/constants";

export function PaymentOptions({ error }: { error?: string }) {
  return (
    <fieldset className="border-surface-800 bg-surface-900/40 rounded-card border p-6 sm:p-8">
      <legend className="text-accent px-2 text-xs font-black tracking-[0.35em] uppercase">
        {CHECKOUT_COPY.paymentLegend}
      </legend>
      <div className="space-y-4">
        {PAYMENT_OPTIONS.map((option, index) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className={`border-surface-700 bg-surface-900 flex cursor-pointer items-start gap-4 rounded-md border p-4 ${
              option.available ? "hover:border-accent" : "cursor-not-allowed opacity-50"
            }`}
          >
            <input
              id={option.id}
              type="radio"
              name={CHECKOUT_FIELDS.paymentProvider}
              value={option.id}
              defaultChecked={index === 0}
              disabled={!option.available}
              className="accent-accent mt-1"
            />
            <span className="space-y-1">
              <span className="block text-sm font-bold text-white">{option.label}</span>
              <span className="text-surface-400 block text-xs">{option.description}</span>
            </span>
          </label>
        ))}
        {error ? (
          <p className="text-danger text-xs font-semibold" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}
