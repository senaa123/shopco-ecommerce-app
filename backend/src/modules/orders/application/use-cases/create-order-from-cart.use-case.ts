import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CART_REPOSITORY,
  type CartRepository,
} from '../../../cart/domain/repositories/cart-repository.interface';
import { Order } from '../../domain/entities/order.entity';
import {
  ORDER_REPOSITORY,
  type OrderRepository,
  type PlaceOrderLine,
} from '../../domain/repositories/order-repository.interface';

export interface CreateOrderInput {
  promoCode?: string;
}

/** The single supported promo code and its discount rate. */
const PROMO_CODE = 'WELCOME20';
const PROMO_RATE = 0.2;

const FLAT_DELIVERY_FEE = 15;
const FREE_DELIVERY_THRESHOLD = 200;

const round = (value: number): number => Math.round(value * 100) / 100;

@Injectable()
export class CreateOrderFromCartUseCase {
  constructor(
    @Inject(CART_REPOSITORY) private readonly cartRepository: CartRepository,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async execute(userId: string, input: CreateOrderInput): Promise<Order> {
    const cartItems = await this.cartRepository.findItemsByUser(userId);
    if (cartItems.length === 0) {
      throw new BadRequestException('Your cart is empty');
    }

    // Recompute the subtotal server-side from current prices — never trust
    // any client-sent total.
    const subtotal = round(
      cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );

    const discount = this.resolveDiscount(subtotal, input.promoCode);
    const discountedSubtotal = round(subtotal - discount);
    const deliveryFee =
      discountedSubtotal > FREE_DELIVERY_THRESHOLD ? 0 : FLAT_DELIVERY_FEE;
    const total = round(discountedSubtotal + deliveryFee);

    const lines: PlaceOrderLine[] = cartItems.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtPurchase: item.unitPrice,
    }));

    return this.orderRepository.placeOrder({
      userId,
      subtotal,
      discount,
      deliveryFee,
      total,
      lines,
    });
  }

  private resolveDiscount(subtotal: number, promoCode?: string): number {
    if (!promoCode) {
      return 0;
    }
    if (promoCode.trim().toUpperCase() !== PROMO_CODE) {
      throw new BadRequestException('Invalid promo code');
    }
    return round(subtotal * PROMO_RATE);
  }
}
