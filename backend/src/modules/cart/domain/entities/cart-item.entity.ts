export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string | null;
}

export interface CartItemVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly productId: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly lineTotal: number,
    public readonly createdAt: Date,
    public readonly product: CartItemProduct,
    public readonly variant: CartItemVariant,
  ) {}
}
