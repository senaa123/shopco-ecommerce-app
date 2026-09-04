import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminOrders } from "@/lib/api";
import type { Order, Paginated } from "@/lib/api-types";

const LIMIT = 20;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let result: Paginated<Order> = { data: [], total: 0, page, limit: LIMIT };
  try {
    result = await getAdminOrders({ page, limit: LIMIT });
  } catch {
    /* AdminShell handles the redirect; render empty otherwise */
  }

  return (
    <OrdersTable
      data={result.data}
      page={result.page}
      limit={result.limit}
      total={result.total}
    />
  );
}
