/** `formatPrice(145)` -> `"$145"`, `formatPrice(145.5)` -> `"$145.50"`. */
export function formatPrice(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded)
    ? `$${rounded}`
    : `$${rounded.toFixed(2)}`;
}

/** The single promo code the backend recognises. */
export const PROMO_CODE = "WELCOME20";
const PROMO_RATE = 0.2;
const FLAT_DELIVERY_FEE = 15;
const FREE_DELIVERY_THRESHOLD = 200;

export interface OrderSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promoApplied: boolean;
}

/**
 * Mirrors the backend's `create-order-from-cart` math so the cart page can
 * preview the totals. Display only — the server always recomputes.
 */
export function computeSummary(
  subtotal: number,
  promoCode?: string | null,
): OrderSummary {
  const round = (n: number) => Math.round(n * 100) / 100;
  const promoApplied =
    !!promoCode && promoCode.trim().toUpperCase() === PROMO_CODE;
  const discount = promoApplied ? round(subtotal * PROMO_RATE) : 0;
  const discounted = round(subtotal - discount);
  const deliveryFee =
    subtotal === 0 || discounted > FREE_DELIVERY_THRESHOLD
      ? 0
      : FLAT_DELIVERY_FEE;
  const total = round(discounted + (subtotal === 0 ? 0 : deliveryFee));
  return { subtotal, discount, deliveryFee, total, promoApplied };
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
