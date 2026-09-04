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

    const existing = await this.cartRepository.findItemByUserAndVariant(
      userId,
      input.variantId,
    );
    const desiredQuantity = (existing?.quantity ?? 0) + input.quantity;

    if (desiredQuantity > variant.stock) {
      throw new BadRequestException(
        `Only ${variant.stock} in stock for this variant`,
      );
    }

    if (existing) {
      // Same variant already in the cart — bump the quantity, don't duplicate.
      await this.cartRepository.updateItemQuantity(
        existing.id,
        desiredQuantity,
      );
    } else {
      await this.cartRepository.createItem({
        userId,
        productId: variant.productId,
        variantId: input.variantId,
        quantity: input.quantity,
      });
    }

    return this.getCartUseCase.execute(userId);
  }
}
