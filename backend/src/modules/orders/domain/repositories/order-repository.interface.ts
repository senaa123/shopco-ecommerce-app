import { OrderStatus } from '@prisma/client';
import { Order } from '../entities/order.entity';

export interface PlaceOrderLine {
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface PlaceOrderInput {
  userId: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  lines: PlaceOrderLine[];
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
}

export interface OrderRepository {
  /**
   * Atomically: re-checks stock for every line, decrements variant stock,
   * creates the Order + OrderItems and clears the user's cart. Throws if stock
   * is insufficient.
   */
  placeOrder(input: PlaceOrderInput): Promise<Order>;
  findByUser(userId: string): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findAllPaginated(page: number, limit: number): Promise<PaginatedOrders>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');
