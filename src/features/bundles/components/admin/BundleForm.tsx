"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import type { AdminActionResult } from "@/features/admin/lib/action-result";
import { upsertBundle } from "@/features/bundles/actions/upsert-bundle";
import { BundleDefinitionFields } from "@/features/bundles/components/admin/BundleDefinitionFields";
import type { BundleDefinition } from "@/features/bundles/config/bundles";

type BundleFormState = AdminActionResult<{ id: string }> & { saved: boolean };

const initialState: BundleFormState = {
  ok: true,
  error: null,
  fieldErrors: {},
  saved: false,
};

async function submitBundle(
  _previous: BundleFormState,
  formData: FormData,
): Promise<BundleFormState> {
  const result = await upsertBundle(formData);
  return { ...result, saved: result.ok };
}

export function BundleForm({ definition }: { definition?: BundleDefinition }) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitBundle, initialState);

  useEffect(() => {
    if (!state.saved) return;
    if (definition) router.refresh();
    else router.push(ADMIN_ROUTES.bundles);
  }, [state.saved, definition, router]);

  return (
    <form action={formAction} className="space-y-6">
      <AdminPanel
        title="Bundle details"
        description="Choose the products and discount used on the public bundles page."
      >
        <BundleDefinitionFields definition={definition} errors={state.fieldErrors} />
      </AdminPanel>
      <div className="flex flex-wrap gap-3">
        <AdminSubmitButton
          label={definition ? ADMIN_COPY.save : ADMIN_COPY.create}
          pendingLabel={ADMIN_COPY.saving}
        />
        <LinkButton href={ADMIN_ROUTES.bundles} variant="ghost">
          {ADMIN_COPY.cancel}
        </LinkButton>
      </div>
      <AdminToast result={state} />
    </form>
  );
}
