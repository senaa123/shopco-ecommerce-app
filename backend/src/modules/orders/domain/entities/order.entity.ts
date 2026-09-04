import { OrderStatus } from '@prisma/client';
import { OrderItem } from './order-item.entity';

export interface OrderPayment {
  id: string;
  method: string;
  status: string;
  amount: number;
  transactionRef: string | null;
}

export interface OrderCustomer {
  name: string;
  email: string;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: OrderStatus,
    public readonly subtotal: number,
    public readonly discount: number,
    public readonly deliveryFee: number,
    public readonly total: number,
    public readonly items: OrderItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly payment: OrderPayment | null = null,
    public readonly customer: OrderCustomer | null = null,
  ) {}
}
