import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/storefront/order-status-badge";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { getAdminOrders, getProducts } from "@/lib/api";
import type { Order, Product } from "@/lib/api-types";
import { formatDate, formatPrice } from "@/lib/format";

export default async function AdminDashboardPage() {
  let orders: Order[] = [];
  let productTotal = 0;
  let products: Product[] = [];

  try {
    const [ordersRes, productsRes] = await Promise.all([
      getAdminOrders({ limit: 100 }),
      getProducts({ limit: 100 }),
    ]);
    orders = ordersRes.data;
    productTotal = productsRes.total;
    products = productsRes.data;
  } catch {
    /* handled by AdminShell / render empty */
  }

  const revenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter(
    (p) => p.variants.reduce((s, v) => s + v.stock, 0) < 10,
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total orders" value={String(orders.length)} />
        <StatCard
          label="Total revenue"
          value={formatPrice(revenue)}
          hint="Excludes cancelled orders"
        />
        <StatCard label="Total products" value={String(productTotal)} />
        <StatCard
          label="Low stock"
          value={String(lowStock)}
          hint="Products with < 10 units across variants"
        />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-bold">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-primary-400">
            No orders yet.
          </p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Order</TH>
                <TH>Customer</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH className="text-right">Total</TH>
              </TR>
            </THead>
            <TBody>
              {orders.slice(0, 8).map((o) => (
                <TR key={o.id}>
                  <TD className="font-mono text-xs">
                    #{o.id.slice(-8).toUpperCase()}
                  </TD>
                  <TD>{o.customer?.name ?? "—"}</TD>
                  <TD className="text-primary-500">
                    {formatDate(o.createdAt)}
                  </TD>
                  <TD>
                    <OrderStatusBadge status={o.status} />
                  </TD>
                  <TD className="text-right font-medium">
                    {formatPrice(o.total)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
