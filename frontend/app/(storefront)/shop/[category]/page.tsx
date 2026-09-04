import type { Metadata } from "next";
import { Breadcrumb } from "@/components/storefront/breadcrumb";
import { FilterSidebar } from "@/components/storefront/filter-sidebar";
import { Pagination } from "@/components/storefront/pagination";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SortSelect } from "@/components/storefront/sort-select";
import { getCategories, getProducts } from "@/lib/api";
import type { Category, Paginated, Product } from "@/lib/api-types";
import {
  DRESS_STYLE_SLUGS,
  titleCase,
  toProductQuery,
  type RawSearchParams,
} from "@/lib/search-params";

const PAGE_SIZE = 9;

function heading(
  category: string,
  search?: string,
  categoryName?: string,
): string {
  if (search) return `Results for “${search}”`;
  if (category === "all") return "All Products";
  if (categoryName) return categoryName;
  if ((DRESS_STYLE_SLUGS as readonly string[]).includes(category.toLowerCase())) {
    return titleCase(category);
  }
  return titleCase(category.replace(/-/g, " "));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return { title: `${heading(category)} — SHOP.CO` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { category } = await params;
  const sp = await searchParams;
  const query = toProductQuery(category, sp, PAGE_SIZE);

  let categories: Category[] = [];
  let result: Paginated<Product> = {
    data: [],
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
  };
  try {
    [categories, result] = await Promise.all([
      getCategories().catch(() => [] as Category[]),
      getProducts(query),
    ]);
  } catch {
    /* backend unreachable — render an empty state */
  }

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));
  const search = Array.isArray(sp.search) ? sp.search[0] : sp.search;
  const from = result.total === 0 ? 0 : (result.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(result.page * PAGE_SIZE, result.total);
  const categoryName = categories.find((c) => c.slug === category)?.name;
  const title = heading(category, search, categoryName);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: title }]}
        className="mb-5"
      />

      <div className="grid gap-6 lg:grid-cols-[295px_1fr]">
        <FilterSidebar category={category} searchParams={sp} />

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-3xl">{title}</h1>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-primary-500 sm:inline">
                Showing {from}-{to} of {result.total} Products
              </span>
              <SortSelect category={category} searchParams={sp} />
            </div>
          </div>

          <ProductGrid
            products={result.data}
            emptyLabel="No products match these filters."
          />

          <Pagination
            basePath={`/shop/${category}`}
            searchParams={sp}
            page={result.page}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
