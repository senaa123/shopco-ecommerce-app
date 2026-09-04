import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { HeroImage } from "@/components/storefront/hero-image";
import { HomeProductRow } from "@/components/storefront/home-product-row";
import { SparkleIcon } from "@/components/storefront/icons";
import { Testimonials } from "@/components/storefront/testimonials";
import { cn } from "@/lib/cn";

const BRANDS = ["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"];

const DRESS_STYLES = [
  {
    label: "Casual",
    slug: "casual",
    img: "/styles/casual.jpg",
    span: "md:col-span-2",
    position: "object-[80%_20%]",
  },
  {
    label: "Formal",
    slug: "formal",
    img: "/styles/formal.jpg",
    span: "md:col-span-3",
    position: "object-[70%_12%]",
  },
  {
    label: "Party",
    slug: "party",
    img: "/styles/party.jpg",
    span: "md:col-span-3",
    position: "object-[65%_12%]",
  },
  {
    label: "Gym",
    slug: "gym",
    img: "/styles/gym.jpg",
    span: "md:col-span-2",
    position: "object-[60%_5%]",
  },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-foreground sm:text-[40px] sm:leading-none">
        {value}
      </p>
      <p className="mt-1 text-xs text-primary-500 sm:text-sm">{label}</p>
    </div>
  );
}

function StatDivider() {
  return <span className="hidden h-12 w-px bg-black/10 sm:block" aria-hidden />;
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F2F0F1]">
        <div className="mx-auto max-w-[1240px] px-4">
          <div className="relative z-10 max-w-[600px] py-12 lg:py-[116px]">
            <h1 className="font-display text-[36px] leading-[0.95] sm:text-[56px] lg:text-[64px]">
              Find clothes that matches your style
            </h1>
            <p className="mt-5 max-w-[545px] text-sm text-primary-600 sm:mt-6 sm:text-base">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of
              style.
            </p>
            <Link
              href="/shop/all"
              className={buttonVariants({
                size: "lg",
                className: "mt-8 w-full px-14 sm:w-[210px]",
              })}
            >
              Shop Now
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-12 sm:gap-x-8">
              <Stat value="200+" label="International Brands" />
              <StatDivider />
              <Stat value="2,000+" label="High-Quality Products" />
              <StatDivider />
              <Stat value="30,000+" label="Happy Customers" />
            </div>
          </div>
        </div>

        {/* Photo — bleeds to the right edge on large screens, stacks below on mobile */}
        <HeroImage className="absolute right-0 top-0 hidden h-full w-[45%] xl:w-[42%] lg:block" />
        <HeroImage className="relative h-[360px] w-full sm:h-[440px] lg:hidden" />

        {/* Decorative sparkles */}
        <SparkleIcon className="absolute right-[7%] top-[16%] hidden h-16 w-16 text-black lg:block xl:h-[104px] xl:w-[104px]" />
        <SparkleIcon className="absolute left-[49%] top-[38%] hidden h-9 w-9 text-black lg:block xl:h-14 xl:w-14" />
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
        <div className="rounded-[20px] bg-surface px-6 py-10 sm:rounded-[40px] md:px-16 md:py-16">
          <h2 className="text-center font-display text-3xl md:text-5xl">
            Browse by dress style
          </h2>
          <div className="mt-9 grid gap-4 sm:gap-5 md:grid-cols-5">
            {DRESS_STYLES.map((s) => (
              <Link
                key={s.slug}
                href={`/shop/${s.slug}`}
                className={cn(
                  "group relative h-[190px] overflow-hidden rounded-[20px] bg-white md:h-[240px] lg:h-[290px]",
                  s.span,
                )}
              >
                <Image
                  src={s.img}
                  alt={`${s.label} style`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className={cn(
                    "object-cover transition-transform duration-500 group-hover:scale-105",
                    s.position,
                  )}
                />
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),rgba(255,255,255,0)_42%)]" />
                <span className="absolute left-6 top-5 z-10 text-2xl font-bold text-foreground">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
