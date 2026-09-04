import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
} from '../../domain/repositories/order-repository.interface';

export interface ListAllOrdersInput {
  page?: number;
  limit?: number;
}

export interface ListAllOrdersResult {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Injectable()
export class ListAllOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(input: ListAllOrdersInput = {}): Promise<ListAllOrdersResult> {
    const page = Math.max(DEFAULT_PAGE, Math.trunc(input.page ?? DEFAULT_PAGE));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Math.trunc(input.limit ?? DEFAULT_LIMIT)),
    );

    const { data, total } = await this.orderRepository.findAllPaginated(
      page,
      limit,
    );
    return { data, total, page, limit };
  }
}
