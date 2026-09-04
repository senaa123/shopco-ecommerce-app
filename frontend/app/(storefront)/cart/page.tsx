import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { CartView } from "@/components/storefront/cart-view";
import { ApiError, getCart } from "@/lib/api";
import type { Cart } from "@/lib/api-types";

export const metadata: Metadata = { title: "Your Cart — SHOP.CO" };

export default async function CartPage() {
  let cart: Cart;
  try {
    cart = await getCart();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect("/login?redirect=/cart");
    cart = { items: [], itemCount: 0, subtotal: 0 };
  }

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        className="mb-4"
      />
      <h1 className="mb-6 font-display text-3xl sm:text-4xl">Your Cart</h1>
      <CartView initial={cart} />
    </div>
  );
}
