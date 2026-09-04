import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Order } from '../../domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order-repository.interface';

export interface OrderRequester {
  id: string;
  role: Role;
}

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(orderId: string, requester: OrderRequester): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const isOwner = order.userId === requester.id;
    if (!isOwner && requester.role !== Role.ADMIN) {
      throw new ForbiddenException('You cannot access this order');
    }

    return order;
  }
}
