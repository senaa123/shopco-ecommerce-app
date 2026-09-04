"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ApiError, updateOrderStatus } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/api-types";
import { formatDate, formatPrice } from "@/lib/format";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrdersTable({
  data,
  page,
  limit,
  total,
}: {
  data: Order[];
  page: number;
  limit: number;
  total: number;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(data);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  async function changeStatus(id: string, status: OrderStatus) {
    setBusyId(id);
    setError(null);
    try {
      const updated = await updateOrderStatus(id, status);
      setRows((r) => r.map((o) => (o.id === id ? updated : o)));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not update the order status",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-3xl">Orders</h1>
      {error && (
        <p className="rounded-xl bg-sale/10 px-4 py-2 text-sm text-sale">
          {error}
        </p>
      )}

      <Table>
        <THead>
          <TR>
            <TH>Order</TH>
            <TH>Customer</TH>
            <TH>Date</TH>
            <TH>Status</TH>
            <TH className="text-right">Total</TH>
            <TH>Change status</TH>
          </TR>
        </THead>
        <TBody>
          {rows.length === 0 ? (
            <TR>
              <TD colSpan={6} className="py-10 text-center text-primary-400">
                No orders.
              </TD>
            </TR>
          ) : (
            rows.map((o) => (
              <TR key={o.id}>
                <TD className="font-mono text-xs">
                  #{o.id.slice(-8).toUpperCase()}
                </TD>
                <TD>
                  <div className="font-medium">{o.customer?.name ?? "—"}</div>
                  <div className="text-xs text-primary-400">
                    {o.customer?.email}
                  </div>
                </TD>
                <TD className="text-primary-500">{formatDate(o.createdAt)}</TD>
                <TD>
                  <OrderStatusBadge status={o.status} />
                </TD>
                <TD className="text-right font-medium">
                  {formatPrice(o.total)}
                </TD>
                <TD>
                  <select
                    disabled={busyId === o.id}
                    value={o.status}
                    onChange={(e) =>
                      changeStatus(o.id, e.target.value as OrderStatus)
                    }
                    className="h-9 rounded-pill bg-surface px-3 text-sm outline-none disabled:opacity-50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </TD>
              </TR>
            ))
          )}
        </TBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <a
            aria-disabled={page <= 1}
            href={`/admin/orders?page=${page - 1}`}
            className={
              page <= 1
                ? "pointer-events-none text-primary-300"
                : "text-primary-600 hover:underline"
            }
          >
            ← Previous
          </a>
          <span className="text-primary-400">
            Page {page} of {totalPages}
          </span>
          <a
            aria-disabled={page >= totalPages}
            href={`/admin/orders?page=${page + 1}`}
            className={
              page >= totalPages
                ? "pointer-events-none text-primary-300"
                : "text-primary-600 hover:underline"
            }
          >
            Next →
          </a>
        </div>
      )}
    </div>
  );
}
