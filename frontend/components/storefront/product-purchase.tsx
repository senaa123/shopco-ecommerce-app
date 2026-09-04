"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { addToCart, ApiError } from "@/lib/api";
import type { Product } from "@/lib/api-types";
import { selectIsAuthenticated, useAuthStore } from "@/lib/stores/auth-store";
import { cn } from "@/lib/cn";

const COLOR_HEX: Record<string, string> = {
  green: "#00C12B",
  red: "#F50606",
  yellow: "#F5DD06",
  orange: "#F57906",
  cyan: "#06CAF5",
  blue: "#063AF5",
  purple: "#7D06F5",
  pink: "#F506A4",
  white: "#FFFFFF",
  black: "#0D0D0D",
  navy: "#1B2A4A",
  olive: "#5A5B37",
  grey: "#8A8A8A",
  gray: "#8A8A8A",
};

export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const setCartCount = useAuthStore((s) => s.setCartCount);

  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants],
  );
  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants],
  );

  const [color, setColor] = useState(colors[0] ?? "");
  const [size, setSize] = useState(sizes[0] ?? "");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<
    { type: "idle" | "loading" } | { type: "error" | "success"; message: string }
  >({ type: "idle" });

  const selectedVariant = product.variants.find(
    (v) => v.color === color && v.size === size,
  );
  const stock = selectedVariant?.stock ?? 0;
  const canAdd = !!selectedVariant && stock > 0 && qty <= stock;

  async function handleAdd() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/product/${product.slug}`);
      return;
    }
    if (!selectedVariant) return;
    setStatus({ type: "loading" });
    try {
      const cart = await addToCart({
        variantId: selectedVariant.id,
        quantity: qty,
      });
      setCartCount(cart.itemCount);
      setStatus({ type: "success", message: "Added to cart" });
      router.refresh();
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof ApiError ? err.message : "Could not add to cart",
      });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {colors.length > 0 && (
        <div className="border-t border-border pt-5">
          <p className="text-sm text-primary-500">Select Color</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((c) => {
              const hex = COLOR_HEX[c.toLowerCase()] ?? "#8A8A8A";
              return (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border",
                    color === c
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border",
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {color === c && (
                    <span className="text-xs text-white mix-blend-difference">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="border-t border-border pt-5">
          <p className="text-sm text-primary-500">Choose Size</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-pill px-5 py-2.5 text-sm",
                  size === s
                    ? "bg-primary text-white"
                    : "bg-surface text-primary-600 hover:bg-surface-muted",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-border pt-5">
        <p className="text-sm text-primary-500">
          {selectedVariant
            ? stock > 0
              ? `${stock} in stock`
              : "Out of stock"
            : "This combination is unavailable"}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <QuantityStepper
            value={qty}
            min={1}
            max={Math.max(1, stock)}
            onChange={setQty}
          />
          <Button
            onClick={handleAdd}
            disabled={!canAdd || status.type === "loading"}
            className="flex-1"
          >
            {status.type === "loading" ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
        {status.type === "error" && (
          <p className="mt-3 text-sm text-sale">{status.message}</p>
        )}
        {status.type === "success" && (
          <p className="mt-3 text-sm text-green-600">
            {status.message} —{" "}
            <a href="/cart" className="underline">
              view cart
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
