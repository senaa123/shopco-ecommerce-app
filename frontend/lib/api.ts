import { apiFetch, ApiError } from "./api-client";
import type {
  AuthUser,
  Cart,
  Category,
  Order,
  OrderStatus,
  Paginated,
  PaymentResult,
  Product,
  Review,
} from "./api-types";

export { ApiError };

/* ----------------------------- auth ----------------------------- */

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>("/auth/me");
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    // Network / backend down — treat as logged out rather than crashing the page.
    return null;
  }
}

export function login(input: { email: string; password: string }) {
  return apiFetch<{ success: boolean; user: AuthUser }>("/auth/login", {
    method: "POST",
    json: input,
  });
}

export function register(input: {
  name: string;
  email: string;
  password: string;
}) {
  return apiFetch<{ success: boolean; user: AuthUser }>("/auth/register", {
    method: "POST",
    json: input,
  });
}

export function logout() {
  return apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" });
}

/** Full profile (incl. `name`) — the JWT payload from /auth/me omits the name. */
export function getMyProfile() {
  return apiFetch<{
    id: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "ADMIN";
    createdAt: string;
  }>("/users/me");
}

/* --------------------------- catalog --------------------------- */

export type ProductSort = "price_asc" | "price_desc" | "newest" | "popular";

export type ProductQuery = {
  categorySlug?: string;
  /** Comma-separated list of product types, e.g. "T-shirts,Jeans". */
  types?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  dressStyle?: string;
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
};

export function getProducts(query: ProductQuery = {}) {
  return apiFetch<Paginated<Product>>("/products", { query });
}

export function getProductBySlug(slug: string) {
  return apiFetch<Product>(`/products/${encodeURIComponent(slug)}`);
}

/** Admin-only — looks a product up by id (storefront uses slugs). */
export function getProductById(id: string) {
  return apiFetch<Product>(`/products/by-id/${encodeURIComponent(id)}`);
}

export function getCategories() {
  return apiFetch<Category[]>("/categories");
}

export function createCategory(input: { name: string; slug?: string }) {
  return apiFetch<Category>("/categories", { method: "POST", json: input });
}

export function updateCategory(
  id: string,
  input: { name?: string; slug?: string },
) {
  return apiFetch<Category>(`/categories/${id}`, {
    method: "PATCH",
    json: input,
  });
}

export interface ProductVariantInput {
  size: string;
  color: string;
  stock: number;
}

export interface ProductWriteInput {
  name: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  categoryId: string;
  type?: string | null;
  dressStyle?: string | null;
  variants: ProductVariantInput[];
  images: { url: string }[];
}

export function createProduct(input: ProductWriteInput) {
  return apiFetch<Product>("/products", { method: "POST", json: input });
}

export function updateProduct(
  id: string,
  input: Partial<Omit<ProductWriteInput, "variants">>,
) {
  return apiFetch<Product>(`/products/${id}`, { method: "PATCH", json: input });
}

export function deleteProduct(id: string) {
  return apiFetch<void>(`/products/${id}`, { method: "DELETE" });
}

/* --------------------------- reviews --------------------------- */

export function getProductReviews(
  productId: string,
  query: { page?: number; limit?: number } = {},
) {
  return apiFetch<Paginated<Review>>(
    `/products/${encodeURIComponent(productId)}/reviews`,
    { query },
  );
}

export function createReview(
  productId: string,
  input: { rating: number; comment: string },
) {
  return apiFetch<Review>(
    `/products/${encodeURIComponent(productId)}/reviews`,
    { method: "POST", json: input },
  );
}

/* ----------------------------- cart ---------------------------- */

export function getCart() {
  return apiFetch<Cart>("/cart");
}

export function addToCart(input: { variantId: string; quantity: number }) {
  return apiFetch<Cart>("/cart/items", { method: "POST", json: input });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiFetch<Cart>(`/cart/items/${itemId}`, {
    method: "PATCH",
    json: { quantity },
  });
}

export function removeCartItem(itemId: string) {
  return apiFetch<Cart>(`/cart/items/${itemId}`, { method: "DELETE" });
}

/* ---------------------------- orders --------------------------- */

export function createOrder(input: { promoCode?: string } = {}) {
  return apiFetch<Order>("/orders", { method: "POST", json: input });
}

export function getMyOrders() {
  return apiFetch<Order[]>("/orders");
}

export function getOrder(id: string) {
  return apiFetch<Order>(`/orders/${id}`);
}

/* ------------------------- admin: orders ----------------------- */

export function getAdminOrders(query: { page?: number; limit?: number } = {}) {
  return apiFetch<Paginated<Order>>("/admin/orders", { query });
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  return apiFetch<Order>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    json: { status },
  });
}

/* --------------------------- payments -------------------------- */

export function payForOrder(input: {
  orderId: string;
  method: "CARD" | "COD";
}) {
  return apiFetch<PaymentResult>("/payments", { method: "POST", json: input });
}
