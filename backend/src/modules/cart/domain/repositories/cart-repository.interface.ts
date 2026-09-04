import { CartItem } from '../entities/cart-item.entity';

export interface CartItemRef {
  id: string;
  userId: string;
  variantId: string;
  quantity: number;
}

export interface VariantForCart {
  id: string;
  size: string;
  color: string;
  stock: number;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string | null;
  };
}

export interface AddCartItemData {
  userId: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartRepository {
  /** Full cart contents for a user, with product/variant detail and line totals. */
  findItemsByUser(userId: string): Promise<CartItem[]>;
  findItemById(id: string): Promise<CartItemRef | null>;
  findVariantForCart(variantId: string): Promise<VariantForCart | null>;
  /**
   * Atomically reserves `quantity` units of the variant's stock and adds (or
   * increments) the cart item. Throws `BadRequestException` if stock is short.
   */
  addItem(data: AddCartItemData): Promise<void>;
  /**
   * Atomically changes the reservation to `quantity`, returning the freed units
   * to stock or taking the extra units from it. Throws if stock is short.
   */
  setItemQuantity(id: string, quantity: number): Promise<void>;
  /** Atomically releases the item's reserved stock and removes it. */
  removeItem(id: string): Promise<void>;
}

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');
