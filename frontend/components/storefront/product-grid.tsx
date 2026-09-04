import { cn } from "@/lib/cn";
import type { Product } from "@/lib/api-types";
import { ProductCard } from "./product-card";

export function ProductGrid({
  products,
  className,
  emptyLabel = "No products found.",
}: {
  products: Product[];
  className?: string;
  emptyLabel?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-primary-400">{emptyLabel}</p>
    );
  }
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
