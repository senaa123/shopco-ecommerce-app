"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, createOrder, payForOrder } from "@/lib/api";
import type { Cart } from "@/lib/api-types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/cn";
import { computeSummary, formatPrice } from "@/lib/format";

type Method = "CARD" | "COD";

export function CheckoutForm({
  cart,
  promo,
}: {
  cart: Cart;
  promo: string | null;
}) {
  const router = useRouter();
  const setCartCount = useAuthStore((s) => s.setCartCount);
  const summary = computeSummary(cart.subtotal, promo);

  const [form, setForm] = useState({ name: "", address: "", city: "" });
  const [method, setMethod] = useState<Method>("CARD");
  const [phase, setPhase] = useState<"form" | "placing" | "payment-failed">(
    "form",
  );
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function pay(id: string) {
    try {
      await payForOrder({ orderId: id, method });
      router.push(`/orders/${id}?placed=1`);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 402 || err.status === 400)) {
        setOrderId(id);
        setPhase("payment-failed");
        setError(err.message);
        return;
      }
      throw err;
    }
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPhase("placing");
    try {
      const order = await createOrder(promo ? { promoCode: promo } : {});
      setCartCount(0); // the backend empties the cart when the order is created
      await pay(order.id);
    } catch (err) {
      setPhase("form");
      setError(
        err instanceof ApiError ? err.message : "Could not place your order",
      );
    }
  }

  async function retry() {
    if (!orderId) return;
    setError(null);
    setPhase("placing");
    try {
      await pay(orderId);
    } catch (err) {
      setPhase("payment-failed");
      setError(
        err instanceof ApiError ? err.message : "Payment failed again",
      );
    }
  }

  if (cart.items.length === 0) {
    return (
      <p className="rounded-[20px] border border-border py-16 text-center text-sm text-primary-400">
        Your cart is empty — nothing to check out.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <form
        onSubmit={placeOrder}
        className="flex flex-col gap-6 rounded-[20px] border border-border p-6"
      >
        <div>
          <h2 className="text-lg font-bold">Shipping address</h2>
          <p className="text-xs text-primary-400">
            Mock checkout — this address isn&apos;t stored anywhere.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              required
              placeholder="Full name"
              value={form.name}
              onChange={set("name")}
            />
            <Input
              required
              placeholder="Street address"
              value={form.address}
              onChange={set("address")}
            />
            <Input
              required
              placeholder="City"
              value={form.city}
              onChange={set("city")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold">Payment method</h2>
          <div className="mt-3 flex flex-col gap-2">
            {(["CARD", "COD"] as Method[]).map((m) => (
              <label
                key={m}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm",
                  method === m ? "border-primary" : "border-border",
                )}
              >
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="accent-primary"
                />
                {m === "CARD" ? "Card (mock gateway)" : "Cash on Delivery"}
              </label>
            ))}
          </div>
          {method === "CARD" && (
            <p className="mt-2 text-xs text-primary-400">
              The mock gateway declines ~10% of card charges at random so you can
              see the retry flow.
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-2xl bg-sale/10 p-4 text-sm text-sale">
            {error}
            {phase === "payment-failed" && (
              <p className="mt-1 text-primary-500">
                Your order was created and is awaiting payment. Try again or
                switch payment method.
              </p>
            )}
          </div>
        )}

        {phase === "payment-failed" ? (
          <div className="flex gap-3">
            <Button type="button" onClick={retry}>
              Retry Payment
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setMethod("COD");
                void retry();
              }}
            >
              Pay with Cash on Delivery
            </Button>
          </div>
        ) : (
          <Button type="submit" size="lg" disabled={phase === "placing"}>
            {phase === "placing" ? "Processing…" : "Place Order"}
          </Button>
        )}
      </form>

      <div className="h-fit rounded-[20px] border border-border p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {cart.items.map((i) => (
            <li key={i.id} className="flex justify-between">
              <span className="text-primary-500">
                {i.product.name} × {i.quantity}
              </span>
              <span>{formatPrice(i.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-primary-500">Subtotal</span>
            <span className="font-medium">{formatPrice(summary.subtotal)}</span>
          </div>
          {summary.discount > 0 && (
            <div className="flex justify-between text-sale">
              <span>Discount</span>
              <span>-{formatPrice(summary.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-primary-500">Delivery Fee</span>
            <span>
              {summary.deliveryFee === 0
                ? "Free"
                : formatPrice(summary.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(summary.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
