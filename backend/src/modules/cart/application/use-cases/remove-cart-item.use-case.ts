import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart-repository.interface';
import { CartView, GetCartUseCase } from './get-cart.use-case';

@Injectable()
export class RemoveCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: CartRepository,
    private readonly getCartUseCase: GetCartUseCase,
  ) {}

  async execute(userId: string, itemId: string): Promise<CartView> {
    const item = await this.cartRepository.findItemById(itemId);
    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.deleteItem(itemId);
    return this.getCartUseCase.execute(userId);
  }
}
