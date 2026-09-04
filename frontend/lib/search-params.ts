import type { ProductQuery, ProductSort } from "./api";

export const DRESS_STYLE_SLUGS = ["casual", "formal", "party", "gym"] as const;
export type DressStyleSlug = (typeof DRESS_STYLE_SLUGS)[number];

const SORT_VALUES: ProductSort[] = [
  "newest",
  "popular",
  "price_asc",
  "price_desc",
];

export const SORT_LABELS: Record<ProductSort, string> = {
  popular: "Most Popular",
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined): number | undefined {
  if (value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Turn `/shop/[category]` + the URL query into a backend `ProductQuery`.
 * `category` may be `all`, a real category slug, or a dress-style slug.
 */
export function toProductQuery(
  category: string,
  sp: RawSearchParams,
  pageSize = 9,
): ProductQuery {
  const query: ProductQuery = { page: 1, limit: pageSize };

  const lower = category.toLowerCase();
  if (category !== "all") {
    if ((DRESS_STYLE_SLUGS as readonly string[]).includes(lower)) {
      query.dressStyle = titleCase(lower);
    } else {
      query.categorySlug = category;
    }
  }

  const types = first(sp.types);
  if (types) query.types = types;

  const dressStyle = first(sp.dressStyle);
  if (dressStyle) query.dressStyle = dressStyle;

  const search = first(sp.search);
  if (search) query.search = search;

  const color = first(sp.color);
  if (color) query.color = color;

  const size = first(sp.size);
  if (size) query.size = size;

  const minPrice = toNumber(first(sp.minPrice));
  if (minPrice !== undefined) query.minPrice = minPrice;

  const maxPrice = toNumber(first(sp.maxPrice));
  if (maxPrice !== undefined) query.maxPrice = maxPrice;

  const sort = first(sp.sort);
  if (sort && (SORT_VALUES as string[]).includes(sort)) {
    query.sort = sort as ProductSort;
  }

  const page = toNumber(first(sp.page));
  if (page !== undefined && page >= 1) query.page = Math.trunc(page);

  return query;
}

/** Build a query string, overriding some keys and dropping empty/false ones. */
export function buildQueryString(
  current: RawSearchParams,
  overrides: Record<string, string | number | undefined | null>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    const v = first(value);
    if (v) params.set(key, v);
  }
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
