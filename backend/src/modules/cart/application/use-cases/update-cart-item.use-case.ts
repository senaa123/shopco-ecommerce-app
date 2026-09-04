import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../domain/repositories/cart-repository.interface';
import { CartView, GetCartUseCase } from './get-cart.use-case';

@Injectable()
export class UpdateCartItemUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: CartRepository,
    private readonly getCartUseCase: GetCartUseCase,
  ) {}

  async execute(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<CartView> {
    const item = await this.cartRepository.findItemById(itemId);
    if (!item || item.userId !== userId) {
      throw new NotFoundException('Cart item not found');
    }

    const variant = await this.cartRepository.findVariantForCart(
      item.variantId,
    );
    if (!variant) {
      throw new NotFoundException('Product variant not found');
    }

    if (quantity > variant.stock) {
      throw new BadRequestException(
        `Only ${variant.stock} in stock for this variant`,
      );
    }

    await this.cartRepository.updateItemQuantity(itemId, quantity);
    return this.getCartUseCase.execute(userId);
  }
}
