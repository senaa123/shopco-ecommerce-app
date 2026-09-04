"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { ApiError, removeCartItem, updateCartItem } from "@/lib/api";
import type { Cart } from "@/lib/api-types";
import { useAuthStore } from "@/lib/stores/auth-store";
import { computeSummary, formatPrice, PROMO_CODE } from "@/lib/format";
import { ArrowRightIcon, TrashIcon } from "./icons";
import { ProductImage } from "./product-image";

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "muted" | "sale";
}) {
  return (
    <div className="flex items-center justify-between text-base">
      <span className={tone === "muted" ? "text-primary-500" : "text-primary-500"}>
        {label}
      </span>
      <span
        className={
          tone === "sale" ? "font-medium text-sale" : "font-bold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function CartView({ initial }: { initial: Cart }) {
  const router = useRouter();
  const setCartCount = useAuthStore((s) => s.setCartCount);
  const [cart, setCart] = useState<Cart>(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Keep the navbar badge in sync with the server-rendered cart.
  useEffect(() => {
    setCartCount(initial.itemCount);
  }, [initial.itemCount, setCartCount]);

  const summary = computeSummary(cart.subtotal, promo);

  async function mutate(fn: () => Promise<Cart>, id: string) {
    setBusyId(id);
    setError(null);
    try {
      const next = await fn();
      setCart(next);
      setCartCount(next.itemCount);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-[20px] border border-border py-20 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-primary-400">
          Add a few pieces you love and they&apos;ll show up here.
        </p>
        <Link
          href="/shop/all"
          className={buttonVariants({ className: "mt-6 px-10" })}
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-[20px] border border-border p-4 sm:p-6">
        {error && <p className="mb-3 text-sm text-sale">{error}</p>}
        <ul className="divide-y divide-border">
          {cart.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
              <ProductImage
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-24 w-24 shrink-0 rounded-2xl"
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="font-bold hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    type="button"
                    aria-label="Remove item"
                    disabled={busyId === item.id}
                    onClick={() =>
                      mutate(() => removeCartItem(item.id), item.id)
                    }
                    className="text-sale disabled:opacity-40"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-primary-500">
                  Size: <span className="text-foreground">{item.variant.size}</span>
                </p>
                <p className="text-xs text-primary-500">
                  Color:{" "}
                  <span className="text-foreground">{item.variant.color}</span>
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="text-xl font-bold">
                    {formatPrice(item.lineTotal)}
                  </span>
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    min={1}
                    max={item.variant.stock}
                    disabled={busyId === item.id}
                    onChange={(q) =>
                      mutate(() => updateCartItem(item.id, q), item.id)
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-fit rounded-[20px] border border-border p-5 sm:p-6">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="mt-5 flex flex-col gap-4">
          <SummaryRow label="Subtotal" value={formatPrice(summary.subtotal)} />
          <SummaryRow
            label={`Discount${summary.promoApplied ? " (-20%)" : ""}`}
            value={
              summary.discount > 0
                ? `-${formatPrice(summary.discount)}`
                : formatPrice(0)
            }
            tone="sale"
          />
          <SummaryRow
            label="Delivery Fee"
            value={
              summary.deliveryFee === 0 ? "Free" : formatPrice(summary.deliveryFee)
            }
          />
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between text-lg">
              <span>Total</span>
              <span className="text-2xl font-bold">
                {formatPrice(summary.total)}
              </span>
            </div>
          </div>

          <form
            className="mt-1 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const code = promoInput.trim().toUpperCase();
              if (code === PROMO_CODE) {
                setPromo(code);
                setPromoError(null);
              } else {
                setPromo(null);
                setPromoError("That promo code isn't valid.");
              }
            }}
          >
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Add promo code"
              className="h-11 flex-1 rounded-pill bg-surface px-4 text-sm outline-none placeholder:text-primary-400"
            />
            <Button type="submit" className="px-6">
              Apply
            </Button>
          </form>
          {promoError && <p className="text-xs text-sale">{promoError}</p>}
          {summary.promoApplied && (
            <p className="text-xs text-green-600">
              Promo code {PROMO_CODE} applied.
            </p>
          )}

          <Link
            href={
              summary.promoApplied ? `/checkout?promo=${PROMO_CODE}` : "/checkout"
            }
            className={buttonVariants({
              size: "lg",
              className: "mt-1 w-full",
            })}
          >
            Go to Checkout
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
