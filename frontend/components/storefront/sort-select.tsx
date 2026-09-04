"use client";

import { useRouter } from "next/navigation";
import { SORT_LABELS, buildQueryString } from "@/lib/search-params";
import type { RawSearchParams } from "@/lib/search-params";
import type { ProductSort } from "@/lib/api";

const OPTIONS: ProductSort[] = [
  "popular",
  "newest",
  "price_asc",
  "price_desc",
];

export function SortSelect({
  category,
  searchParams,
}: {
  category: string;
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const current =
    (Array.isArray(searchParams.sort)
      ? searchParams.sort[0]
      : searchParams.sort) ?? "popular";

  return (
    <label className="flex items-center gap-2 text-sm text-primary-500">
      Sort by:
      <select
        value={current}
        onChange={(e) => {
          const qs = buildQueryString(searchParams, {
            sort: e.target.value,
            page: null,
          });
          router.push(`/shop/${category}${qs}`);
        }}
        className="rounded-md bg-transparent font-medium text-foreground outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {SORT_LABELS[o]}
          </option>
        ))}
      </select>
    </label>
  );
}
