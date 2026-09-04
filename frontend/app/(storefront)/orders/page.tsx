import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { ApiError, getMyOrders } from "@/lib/api";
import type { Order } from "@/lib/api-types";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "My Orders — SHOP.CO" };

export default async function OrdersPage() {
  let orders: Order[] = [];
  try {
    orders = await getMyOrders();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login?redirect=/orders");
    }
    orders = [];
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8">
      <h1 className="mb-6 font-display text-3xl sm:text-4xl">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-[20px] border border-border py-16 text-center">
          <p className="text-lg font-medium">No orders yet</p>
          <p className="mt-1 text-sm text-primary-400">
            When you place an order it will appear here.
          </p>
          <Link
            href="/shop/all"
            className={buttonVariants({ className: "mt-6 px-10" })}
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-5 hover:bg-surface"
              >
                <div>
                  <p className="font-mono text-sm text-primary-500">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-primary-400">
                    {formatDate(order.createdAt)} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-lg font-bold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
