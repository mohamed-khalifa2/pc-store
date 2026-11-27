import { Input } from "@/components/ui/Input";
import { FormField } from "@/features/admin/components/FormField";
import type { AdminFieldErrors } from "@/features/admin/lib/action-result";
import type { BundleDefinition } from "@/features/bundles/config/bundles";

const TEXTAREA_CLASS =
  "bg-surface-900 border-surface-700 min-h-24 w-full rounded-md border px-4 py-3 text-sm text-white";

type BundleDefinitionFieldsProps = {
  definition?: BundleDefinition;
  errors: AdminFieldErrors;
};

export function BundleDefinitionFields({ definition, errors }: BundleDefinitionFieldsProps) {
  const errorFor = (field: string) => errors[field]?.[0];
  const id = definition?.id ?? "";

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {definition ? (
        <FormField label="Bundle ID" hint="The ID cannot be changed after creation.">
          <input type="hidden" name="id" value={id} readOnly />
          <p className="text-surface-300 font-mono text-sm">{id}</p>
        </FormField>
      ) : (
        <FormField
          label="Bundle ID"
          htmlFor="bundle-id"
          hint="Lowercase letters, numbers and hyphens."
          error={errorFor("id")}
        >
          <Input id="bundle-id" name="id" defaultValue={id} required />
        </FormField>
      )}
      <FormField label="Slug" htmlFor="bundle-slug" error={errorFor("slug")}>
        <Input id="bundle-slug" name="slug" defaultValue={definition?.slug ?? ""} required />
      </FormField>
      <FormField label="Name" htmlFor="bundle-name" error={errorFor("name")}>
        <Input id="bundle-name" name="name" defaultValue={definition?.name ?? ""} required />
      </FormField>
      <FormField label="Tag" htmlFor="bundle-tag" error={errorFor("tag")}>
        <Input id="bundle-tag" name="tag" defaultValue={definition?.tag ?? ""} required />
      </FormField>
      <FormField label="Discount (%)" htmlFor="bundle-discount" error={errorFor("discountPercent")}>
        <Input
          id="bundle-discount"
          name="discountPercent"
          type="number"
          min={1}
          max={50}
          defaultValue={definition?.discountPercent ?? 5}
          required
        />
      </FormField>
      <FormField
        label="Product slugs"
        htmlFor="bundle-products"
        hint="Two to six slugs, separated by lines or commas."
        error={errorFor("productSlugs")}
      >
        <textarea
          id="bundle-products"
          name="productSlugs"
          defaultValue={definition?.productSlugs.join("\n") ?? ""}
          className={TEXTAREA_CLASS}
          required
        />
      </FormField>
      <div className="md:col-span-2">
        <FormField label="Description" htmlFor="bundle-description" error={errorFor("description")}>
          <textarea
            id="bundle-description"
            name="description"
            defaultValue={definition?.description ?? ""}
            className={TEXTAREA_CLASS}
            required
          />
        </FormField>
      </div>
    </div>
  );
}
