import { Heading } from "@/components/ui/Heading";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import type { ProductSpec } from "@/features/products/types";

type ProductSpecsTableProps = {
  specs: ProductSpec[];
};

export function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  if (specs.length === 0) return null;

  return (
    <div className="border-surface-800 rounded-card border p-5">
      <Heading level={2} size="card">
        {PRODUCT_COPY.specifications}
      </Heading>
      <table className="mt-4 w-full text-left text-sm">
        <caption className="sr-only">{PRODUCT_COPY.specsCaption}</caption>
        <tbody>
          {specs.map((spec) => (
            <tr key={spec.label} className="border-surface-800 border-t">
              <th scope="row" className="text-surface-400 py-3 pr-4 font-bold">
                {spec.label}
              </th>
              <td className="py-3 font-black text-white">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
