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

export interface CreateCartItemData {
  userId: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartRepository {
  /** Full cart contents for a user, with product/variant detail and line totals. */
  findItemsByUser(userId: string): Promise<CartItem[]>;
  findItemById(id: string): Promise<CartItemRef | null>;
  findItemByUserAndVariant(
    userId: string,
    variantId: string,
  ): Promise<CartItemRef | null>;
  findVariantForCart(variantId: string): Promise<VariantForCart | null>;
  createItem(data: CreateCartItemData): Promise<void>;
  updateItemQuantity(id: string, quantity: number): Promise<void>;
  deleteItem(id: string): Promise<void>;
}

export const CART_REPOSITORY = Symbol('CART_REPOSITORY');
