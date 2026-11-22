import { PRODUCT_COPY } from "@/features/products/config/copy";

type ProductStockProps = {
  stock: number;
};

export function ProductStock({ stock }: ProductStockProps) {
  if (stock <= 0) {
    return <p className="text-danger text-sm font-black uppercase">{PRODUCT_COPY.outOfStock}</p>;
  }

  return (
    <p className="text-accent-soft text-sm font-black tracking-[0.12em] uppercase">
      {stock} {PRODUCT_COPY.inStockStatus}
    </p>
  );
}
