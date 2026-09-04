import Link from "next/link";
import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api-types";
import { AccountMenu } from "./account-menu";
import { CartLink } from "./cart-link";
import { SearchBar } from "./search-bar";
import { ShopMenu } from "./shop-menu";

export async function Navbar() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center gap-4 px-4 sm:gap-6 lg:gap-10">
        <Link href="/" className="font-display text-2xl font-bold tracking-tight">
          SHOP.CO
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <ShopMenu categories={categories} />
          <Link href="/shop/all?sort=price_asc">On Sale</Link>
          <Link href="/shop/all?sort=newest">New Arrivals</Link>
          <Link href="/shop/all">Brands</Link>
        </nav>

        <SearchBar className="hidden flex-1 lg:block" />

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <CartLink />
          <AccountMenu />
        </div>
      </div>

      <div className="border-t border-border px-4 py-3 lg:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
