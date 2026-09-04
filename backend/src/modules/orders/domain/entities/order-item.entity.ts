export interface OrderItemVariant {
  id: string;
  size: string;
  color: string;
}

export interface OrderItemProduct {
  id: string;
  name: string;
  slug: string;
}

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly priceAtPurchase: number,
    public readonly lineTotal: number,
    public readonly variant: OrderItemVariant | null = null,
    public readonly product: OrderItemProduct | null = null,
  ) {}
}
