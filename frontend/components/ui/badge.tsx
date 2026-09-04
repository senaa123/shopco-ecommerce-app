import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Tone = "sale" | "neutral" | "success";

const TONES: Record<Tone, string> = {
  sale: "bg-sale/10 text-sale",
  neutral: "bg-surface text-primary-600",
  success: "bg-green-100 text-green-700",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/** `-30%` style discount pill derived from price + discountPrice. */
export function DiscountBadge({
  price,
  discountPrice,
  className,
}: {
  price: number;
  discountPrice: number | null;
  className?: string;
}) {
  if (!discountPrice || discountPrice >= price) return null;
  const pct = Math.round(((price - discountPrice) / price) * 100);
  return (
    <Badge tone="sale" className={className}>
      -{pct}%
    </Badge>
  );
}
