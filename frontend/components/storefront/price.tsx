import { DiscountBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export function Price({
  price,
  discountPrice,
  size = "md",
  className,
}: {
  price: number;
  discountPrice?: number | null;
  size?: "md" | "lg";
  className?: string;
}) {
  const hasDiscount = !!discountPrice && discountPrice < price;
  const current = hasDiscount ? discountPrice! : price;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "font-bold text-foreground",
          size === "lg" ? "text-2xl" : "text-xl",
        )}
      >
        {formatPrice(current)}
      </span>
      {hasDiscount && (
        <>
          <span
            className={cn(
              "font-bold text-primary-300 line-through",
              size === "lg" ? "text-2xl" : "text-xl",
            )}
          >
            {formatPrice(price)}
          </span>
          <DiscountBadge price={price} discountPrice={discountPrice ?? null} />
        </>
      )}
    </div>
  );
}
