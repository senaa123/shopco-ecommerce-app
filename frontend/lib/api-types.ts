/** Shared response shapes returned by the NestJS backend. */

export type Role = "CUSTOMER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatusValue = "PENDING" | "SUCCESS" | "FAILED";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number | null;
  categoryId: string;
  type: string | null;
  dressStyle: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category | null;
  variants: ProductVariant[];
  images: ProductImage[];
  averageRating: number;
  reviewCount: number;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string | null;
  };
  variant: {
    id: string;
    size: string;
    color: string;
    stock: number;
  };
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
  lineTotal: number;
  variant: { id: string; size: string; color: string } | null;
  product: { id: string; name: string; slug: string } | null;
}

export interface OrderPayment {
  id: string;
  method: string;
  status: string;
  amount: number;
  transactionRef: string | null;
}

export interface OrderCustomer {
  name: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  payment: OrderPayment | null;
  customer: OrderCustomer | null;
}

export interface PaymentResult {
  success: true;
  payment: {
    id: string;
    orderId: string;
    method: string;
    status: PaymentStatusValue;
    transactionRef: string | null;
    amount: number;
    createdAt: string;
  };
}
