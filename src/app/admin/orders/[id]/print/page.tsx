import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { SHIPPING_KEYS } from "@/features/checkout/config/shipping-keys";
import { PrintButton } from "@/features/orders/components/admin/PrintButton";
import { ORDER_COPY } from "@/features/orders/config/copy";
import { formatOrderDate } from "@/features/orders/lib/format-date";
import { getAdminOrder } from "@/features/orders/queries/get-admin-order";
import { ORDER_STATUS_LABELS, SITE_NAME } from "@/lib/constants";
import { formatEgp } from "@/lib/format/currency";

export const metadata: Metadata = {
  title: "Invoice",
  robots: { index: false, follow: false },
};

type PrintOrderPageProps = { params: Promise<{ id: string }> };

export default async function PrintOrderPage({ params }: PrintOrderPageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  const address = order.shipping_address;

  return (
    <div className="print:fixed print:inset-0 print:z-[100] print:overflow-auto print:bg-white print:text-black">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={ADMIN_ROUTES.order(order.id)}
          className="text-surface-400 hover:text-accent text-xs font-black uppercase"
        >
          ← Back to order
        </Link>
        <PrintButton />
      </div>

      <article className="border-surface-800 bg-surface-900 rounded-card mx-auto max-w-3xl border p-8 sm:p-10 print:mx-0 print:max-w-none print:border-0 print:bg-white print:p-0 print:text-black">
        <header className="border-surface-800 flex flex-wrap items-start justify-between gap-6 border-b pb-6 print:border-black print:text-black">
          <div>
            <p className="text-accent text-xs font-black tracking-[0.3em] print:text-black">
              {SITE_NAME}
            </p>
            <h1 className="mt-3 text-3xl font-black">Invoice</h1>
          </div>
          <div className="text-right text-sm print:text-black">
            <p className="font-mono font-bold">{order.order_number}</p>
            <p className="text-surface-400 print:text-black">
              {ORDER_COPY.placedLabel} {formatOrderDate(order.placed_at)}
            </p>
            <p className="text-surface-400 print:text-black">
              Status: {ORDER_STATUS_LABELS[order.status]}
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 print:gap-4">
          <div className="print:text-black">
            <h2 className="text-xs font-black tracking-[0.2em] uppercase">Bill to</h2>
            <p className="text-surface-300 mt-3 text-sm font-bold print:text-black">
              {address[SHIPPING_KEYS.fullName]}
            </p>
            <p className="text-surface-400 text-sm print:text-black">
              {address[SHIPPING_KEYS.address]}
            </p>
            <p className="text-surface-400 text-sm print:text-black">
              {address[SHIPPING_KEYS.city]}, {address[SHIPPING_KEYS.governorate]}
            </p>
            <p className="text-surface-400 text-sm print:text-black">
              {order.customer_phone ?? address[SHIPPING_KEYS.phone]}
            </p>
            {order.customer_email ? (
              <p className="text-surface-400 text-sm print:text-black">{order.customer_email}</p>
            ) : null}
          </div>
          <div className="print:text-black">
            <h2 className="text-xs font-black tracking-[0.2em] uppercase">Payment</h2>
            <p className="text-surface-300 mt-3 text-sm font-bold print:text-black">
              Order summary
            </p>
            <p className="text-surface-400 text-sm print:text-black">Currency: {order.currency}</p>
            <p className="text-surface-400 text-sm print:text-black">
              Items: {order.order_items.length}
            </p>
          </div>
        </section>

        <table className="mt-10 w-full border-collapse text-left text-sm print:mt-6">
          <caption className="sr-only">Invoice items</caption>
          <thead className="border-surface-800 border-b print:border-black">
            <tr className="text-surface-400 text-xs tracking-widest uppercase print:text-black">
              <th scope="col" className="py-3">
                Item
              </th>
              <th scope="col" className="py-3">
                Qty
              </th>
              <th scope="col" className="py-3 text-right">
                Unit
              </th>
              <th scope="col" className="py-3 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-surface-800 divide-y print:divide-gray-300">
            {order.order_items.map((item) => (
              <tr key={item.id} className="print:text-black">
                <td className="py-4 font-bold">
                  {item.product_name}
                  {item.sku ? (
                    <span className="text-surface-500 block text-xs print:text-black">
                      {item.sku}
                    </span>
                  ) : null}
                </td>
                <td className="py-4 font-mono">{item.quantity}</td>
                <td className="py-4 text-right font-mono">{formatEgp(item.unit_price_egp)}</td>
                <td className="py-4 text-right font-mono font-bold">
                  {formatEgp(item.line_total_egp ?? item.unit_price_egp * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-surface-800 mt-8 flex items-center justify-between border-t pt-6 print:border-black print:text-black">
          <span className="text-sm font-black uppercase">Total</span>
          <span className="text-2xl font-black">{formatEgp(order.total_egp)}</span>
        </div>
      </article>
    </div>
  );
}
