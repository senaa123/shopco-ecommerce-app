import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { ApiError, getOrder } from "@/lib/api";
import type { Order } from "@/lib/api-types";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Order — SHOP.CO" };

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { id } = await params;
  const { placed } = await searchParams;

  let order: Order;
  try {
    order = await getOrder(id);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) redirect(`/login?redirect=/orders/${id}`);
      if (err.status === 404 || err.status === 403) notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-8">
      {placed && (
        <div className="mb-6 rounded-2xl bg-green-50 p-5 text-center">
          <p className="text-lg font-bold text-green-700">
            Thank you — your order is confirmed!
          </p>
          <p className="mt-1 text-sm text-green-700/80">
            {order.payment?.status === "SUCCESS"
              ? `Payment of ${formatPrice(order.payment.amount)} received.`
              : "We'll process it shortly."}
          </p>
        </div>
      )}

      <Link href="/orders" className="text-sm text-primary-400 hover:underline">
        ← Back to orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-primary-400">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-6 rounded-[20px] border border-border p-6">
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-4 first:pt-0">
              <div>
                <p className="font-medium">
                  {item.product?.name ?? "Product"}{" "}
                  <span className="text-primary-400">× {item.quantity}</span>
                </p>
                {item.variant && (
                  <p className="text-xs text-primary-400">
                    {item.variant.size} · {item.variant.color}
                  </p>
                )}
              </div>
              <span className="font-medium">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-primary-500">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sale">
              <dt>Discount</dt>
              <dd>-{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-primary-500">Delivery Fee</dt>
            <dd>
              {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>

        {order.payment && (
          <p className="mt-4 text-xs text-primary-400">
            Payment: {order.payment.method} · {order.payment.status}
            {order.payment.transactionRef
              ? ` · ${order.payment.transactionRef}`
              : ""}
          </p>
        )}
      </div>

      {order.status === "PENDING" && (
        <Link
          href="/checkout"
          className={buttonVariants({ className: "mt-5 px-8" })}
        >
          Complete payment
        </Link>
      )}
    </div>
  );
}
