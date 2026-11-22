import { SHIPPING_KEYS } from "@/features/checkout/config/shipping-keys";
import { ORDER_COPY } from "@/features/orders/config/copy";
import type { ShippingAddress } from "@/features/orders/schemas/order";

type OrderAddressProps = {
  address: ShippingAddress;
  email: string | null;
  phone: string | null;
};

export function OrderAddress({ address, email, phone }: OrderAddressProps) {
  return (
    <div className="border-surface-800 bg-surface-900/60 rounded-card border p-6 sm:p-8">
      <h2 className="text-lg font-black text-white">{ORDER_COPY.deliveryTitle}</h2>
      <address className="text-surface-200 mt-5 space-y-1 text-sm not-italic">
        <p className="font-bold text-white">{address[SHIPPING_KEYS.fullName]}</p>
        <p>{address[SHIPPING_KEYS.address]}</p>
        <p>
          {address[SHIPPING_KEYS.city]}, {address[SHIPPING_KEYS.governorate]}
        </p>
        <p>{phone ?? address[SHIPPING_KEYS.phone]}</p>
        {email ? <p className="text-surface-400 text-xs">{email}</p> : null}
        {address[SHIPPING_KEYS.notes] ? (
          <p className="text-surface-400 pt-3 text-xs">{address[SHIPPING_KEYS.notes]}</p>
        ) : null}
      </address>
    </div>
  );
}
