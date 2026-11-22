"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { FormField } from "@/features/admin/components/FormField";
import { initialAdminResult, type AdminActionResult } from "@/features/admin/lib/action-result";
import { updateOrderStatus } from "@/features/orders/actions/update-order-status";
import type { OrderStatus } from "@/features/orders/schemas/order";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const SELECT_CLASS =
  "bg-surface-900 border-surface-700 h-11 w-full rounded-md border px-4 text-sm text-white focus-visible:ring-accent";

async function submitStatus(
  _previous: AdminActionResult,
  formData: FormData,
): Promise<AdminActionResult> {
  return updateOrderStatus(formData);
}

type OrderStatusFormProps = { orderId: string; status: OrderStatus };

export function OrderStatusForm({ orderId, status }: OrderStatusFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(submitStatus, initialAdminResult);

  useEffect(() => {
    if (state.ok && state.error) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="orderId" value={orderId} readOnly />
      <FormField
        label="Fulfilment status"
        htmlFor="admin-order-status"
        error={state.fieldErrors.status?.[0]}
      >
        <select
          id="admin-order-status"
          name="status"
          defaultValue={status}
          className={SELECT_CLASS}
        >
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </FormField>
      <AdminSubmitButton label={ADMIN_COPY.save} pendingLabel={ADMIN_COPY.saving} size="sm" />
      <AdminToast result={state} />
    </form>
  );
}
