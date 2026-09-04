import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { ApiError, getCart } from "@/lib/api";
import type { Cart } from "@/lib/api-types";
import { PROMO_CODE } from "@/lib/format";

export const metadata: Metadata = { title: "Checkout — SHOP.CO" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ promo?: string }>;
}) {
  const { promo } = await searchParams;

  let cart: Cart;
  try {
    cart = await getCart();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login?redirect=/checkout");
    }
    cart = { items: [], itemCount: 0, subtotal: 0 };
  }

  const validPromo =
    promo && promo.trim().toUpperCase() === PROMO_CODE ? PROMO_CODE : null;

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <h1 className="mb-6 font-display text-3xl sm:text-4xl">Checkout</h1>
      <CheckoutForm cart={cart} promo={validPromo} />
    </div>
  );
}
