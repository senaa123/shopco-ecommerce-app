import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/api-types";

const MAP: Record<OrderStatus, { tone: "sale" | "neutral" | "success"; label: string }> =
  {
    PENDING: { tone: "neutral", label: "Pending" },
    PAID: { tone: "success", label: "Paid" },
    SHIPPED: { tone: "neutral", label: "Shipped" },
    DELIVERED: { tone: "success", label: "Delivered" },
    CANCELLED: { tone: "sale", label: "Cancelled" },
  };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = MAP[status];
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
