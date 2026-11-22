import { requireUser } from "@/features/auth/lib/require-user";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";

export async function CheckoutContainer() {
  const user = await requireUser();
  return <CheckoutForm email={user.email} />;
}
