export const SHIPPING_KEYS = {
  fullName: "full_name",
  phone: "phone",
  governorate: "governorate",
  city: "city",
  address: "address",
  notes: "notes",
} as const;

export type ShippingAddressSnapshot = {
  [SHIPPING_KEYS.fullName]: string;
  [SHIPPING_KEYS.phone]: string;
  [SHIPPING_KEYS.governorate]: string;
  [SHIPPING_KEYS.city]: string;
  [SHIPPING_KEYS.address]: string;
  [SHIPPING_KEYS.notes]: string;
};
