"use client";

import { MinusIcon, PlusIcon } from "@/components/storefront/icons";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  disabled,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const dim = size === "sm" ? "h-9" : "h-11";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-between gap-2 rounded-pill bg-surface px-4",
        dim,
        size === "sm" ? "w-28" : "w-36",
        disabled && "opacity-50",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="text-foreground disabled:text-primary-300"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="text-foreground disabled:text-primary-300"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
