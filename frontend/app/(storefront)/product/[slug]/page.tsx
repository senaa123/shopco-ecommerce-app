import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/ui/star-rating";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { Price } from "@/components/storefront/price";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ProductPurchase } from "@/components/storefront/product-purchase";
import { ProductTabs } from "@/components/storefront/product-tabs";
import { ApiError, getProductBySlug, getProductReviews, getProducts } from "@/lib/api";
import type { Paginated, Product, Review } from "@/lib/api-types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    return { title: `${product.name} — SHOP.CO`, description: product.description };
  } catch {
    return { title: "Product — SHOP.CO" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product;
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const emptyReviews: Paginated<Review> = {
    data: [],
    total: 0,
    page: 1,
    limit: 6,
  };
  const [reviews, related] = await Promise.all([
    getProductReviews(product.id, { limit: 6 }).catch(() => emptyReviews),
    getProducts({
      categorySlug: product.category?.slug,
      limit: 5,
    }).catch(() => ({ data: [] as Product[], total: 0, page: 1, limit: 5 })),
  ]);

  const alsoLike = related.data
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop/all" },
          ...(product.category
            ? [
                {
                  label: product.category.name,
                  href: `/shop/${product.category.slug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-display text-3xl sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            {product.reviewCount > 0 ? (
              <StarRating
                rating={product.averageRating}
                count={product.reviewCount}
              />
            ) : (
              <span className="text-sm text-primary-400">No reviews yet</span>
            )}
          </div>
          <div className="mt-4">
            <Price
              price={product.price}
              discountPrice={product.discountPrice}
              size="lg"
            />
          </div>
          <p className="mt-4 border-b border-border pb-6 text-sm leading-6 text-primary-500">
            {product.description}
          </p>
          <div className="mt-6">
            <ProductPurchase product={product} />
          </div>
        </div>
      </div>

      <ProductTabs product={product} reviews={reviews} />

      {alsoLike.length > 0 && (
        <section className="mt-16 text-center">
          <h2 className="font-display text-3xl md:text-5xl">
            You might also like
          </h2>
          <div className="mt-10 text-left">
            <ProductGrid products={alsoLike} />
          </div>
        </section>
      )}
    </div>
  );
}
