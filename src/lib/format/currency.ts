const egpFormatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
});

export function formatEgp(value: number): string {
  return egpFormatter.format(value);
}
