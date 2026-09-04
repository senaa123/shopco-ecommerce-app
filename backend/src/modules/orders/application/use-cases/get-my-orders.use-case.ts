import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order-repository.interface';

@Injectable()
export class GetMyOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  execute(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUser(userId);
  }
}
