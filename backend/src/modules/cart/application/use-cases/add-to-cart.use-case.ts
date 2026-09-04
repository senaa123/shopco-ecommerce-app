import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart-repository.interface';
import { CartView, GetCartUseCase } from './get-cart.use-case';

export interface AddToCartInput {
  variantId: string;
  quantity: number;
}

@Injectable()
export class AddToCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: CartRepository,
    private readonly getCartUseCase: GetCartUseCase,
  ) {}

  async execute(userId: string, input: AddToCartInput): Promise<CartView> {
    const variant = await this.cartRepository.findVariantForCart(
      input.variantId,
    );
    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    // Reserves the stock and merges into an existing line for the same variant
    // atomically — throws BadRequestException when stock is insufficient.
    await this.cartRepository.addItem({
      userId,
      productId: variant.productId,
      variantId: input.variantId,
      quantity: input.quantity,
    });

    return this.getCartUseCase.execute(userId);
  }
}
