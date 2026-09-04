import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getProducts, type ProductQuery } from "@/lib/api";
import type { Product } from "@/lib/api-types";
import { ProductGrid } from "./product-grid";

/**
 * Async server component: fetches a small product row for the homepage. Wrap it
 * in <Suspense> with a <ProductGridSkeleton /> fallback.
 */
export async function HomeProductRow({
  title,
  query,
  viewAllHref,
}: {
  title: string;
  query: ProductQuery;
  viewAllHref: string;
}) {
  let products: Product[] = [];
  try {
    const result = await getProducts({ limit: 4, ...query });
    products = result.data;
  } catch {
    products = [];
  }

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-14 text-center">
      <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
      <div className="mt-10 text-left">
        <ProductGrid
          products={products}
          emptyLabel="Nothing here yet — add products from the admin panel."
        />
      </div>
      {products.length > 0 && (
        <Link
          href={viewAllHref}
          className={buttonVariants({
            variant: "secondary",
            size: "md",
            className: "mt-9 px-14",
          })}
        >
          View All
        </Link>
      )}
    </section>
  );
}
