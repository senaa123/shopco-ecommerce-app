import Link from "next/link";
import { StarRating } from "@/components/ui/star-rating";
import type { Product } from "@/lib/api-types";
import { ProductImage } from "./product-image";
import { Price } from "./price";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col gap-3">
      <ProductImage
        src={product.images[0]?.url}
        alt={product.name}
        className="aspect-square w-full rounded-[20px] transition-opacity group-hover:opacity-90"
      />
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-bold text-foreground">{product.name}</h3>
        {product.reviewCount > 0 ? (
          <StarRating rating={product.averageRating} />
        ) : (
          <span className="text-sm text-primary-400">No reviews yet</span>
        )}
        <Price price={product.price} discountPrice={product.discountPrice} />
      </div>
    </Link>
  );
}
