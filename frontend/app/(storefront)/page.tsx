import { Suspense } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { HomeProductRow } from "@/components/storefront/home-product-row";
import { Testimonials } from "@/components/storefront/testimonials";

const BRANDS = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

const DRESS_STYLES = [
  { label: "Casual", slug: "casual", span: "md:col-span-2" },
  { label: "Formal", slug: "formal", span: "md:col-span-3" },
  { label: "Party", slug: "party", span: "md:col-span-3" },
  { label: "Gym", slug: "gym", span: "md:col-span-2" },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold sm:text-3xl">{value}</p>
      <p className="text-xs text-primary-500 sm:text-sm">{label}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Find clothes that matches your style
            </h1>
            <p className="max-w-md text-sm text-primary-500">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </p>
            <Link
              href="/shop/all"
              className={buttonVariants({
                size: "lg",
                className: "w-full sm:w-52",
              })}
            >
              Shop Now
            </Link>
            <div className="mt-2 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-6">
              <Stat value="200+" label="International Brands" />
              <Stat value="2,000+" label="High-Quality Products" />
              <Stat value="30,000+" label="Happy Customers" />
            </div>
          </div>
          <div className="relative hidden min-h-[380px] items-center justify-center rounded-[20px] bg-primary-200 md:flex">
            <span className="font-display text-5xl text-white/70">SHOP.CO</span>
            <span className="absolute right-6 top-10 text-4xl">✦</span>
            <span className="absolute bottom-16 left-8 text-2xl">✦</span>
          </div>
        </div>
      </section>

      {/* Brand strip */}
      <div className="bg-primary">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-8 md:justify-between">
          {BRANDS.map((b) => (
            <span
              key={b}
              className="font-display text-xl text-white sm:text-2xl md:text-3xl"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1240px] px-4 py-14">
            <ProductGridSkeleton />
          </div>
        }
      >
        <HomeProductRow
          title="New Arrivals"
          query={{ sort: "newest" }}
          viewAllHref="/shop/all?sort=newest"
        />
      </Suspense>

      <div className="mx-auto max-w-[1240px] px-4">
        <hr className="border-border" />
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1240px] px-4 py-14">
            <ProductGridSkeleton />
          </div>
        }
      >
        <HomeProductRow
          title="Top Selling"
          query={{ sort: "popular" }}
          viewAllHref="/shop/all?sort=popular"
        />
      </Suspense>

      {/* Browse by dress style */}
      <section className="mx-auto max-w-[1240px] px-4 py-8">
        <div className="rounded-[40px] bg-surface px-6 py-10 md:px-16 md:py-16">
          <h2 className="text-center font-display text-3xl md:text-5xl">
            Browse by dress style
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-5">
            {DRESS_STYLES.map((s) => (
              <Link
                key={s.slug}
                href={`/shop/${s.slug}`}
                className={`${s.span} flex h-48 items-start justify-start overflow-hidden rounded-[20px] bg-white p-6 transition-shadow hover:shadow-md`}
              >
                <span className="text-2xl font-bold">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
