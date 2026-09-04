import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { Order } from '../../domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order-repository.interface';

/**
 * Legal status transitions:
 *   PENDING -> PAID -> SHIPPED -> DELIVERED
 *   PENDING -> CANCELLED, PAID -> CANCELLED
 */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: string, nextStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === nextStatus) {
      return order;
    }

    if (!ALLOWED_TRANSITIONS[order.status].includes(nextStatus)) {
      throw new BadRequestException(
        `Cannot transition order from ${order.status} to ${nextStatus}`,
      );
    }

    return this.orderRepository.updateStatus(orderId, nextStatus);
  }
}
