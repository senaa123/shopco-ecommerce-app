import { Inject, Injectable } from '@nestjs/common';
import { CartItem } from '../../domain/entities/cart-item.entity';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart-repository.interface';

export interface CartView {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

const round = (value: number): number => Math.round(value * 100) / 100;

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: CartRepository,
  ) {}

  async execute(userId: string): Promise<CartView> {
    const items = await this.cartRepository.findItemsByUser(userId);
    const subtotal = round(
      items.reduce((sum, item) => sum + item.lineTotal, 0),
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, itemCount, subtotal };
  }
}
