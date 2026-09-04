import Link from "next/link";
import { cn } from "@/lib/cn";
import { buildQueryString } from "@/lib/search-params";
import type { RawSearchParams } from "@/lib/search-params";
import { ArrowRightIcon } from "./icons";

function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function Pagination({
  basePath,
  searchParams,
  page,
  totalPages,
}: {
  basePath: string;
  searchParams: RawSearchParams;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) =>
    `${basePath}${buildQueryString(searchParams, { page: p === 1 ? null : p })}`;

  return (
    <nav className="mt-8 flex items-center justify-between border-t border-border pt-5">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
        >
          <ArrowRightIcon className="h-4 w-4 rotate-180" />
          Previous
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary-300">
          <ArrowRightIcon className="h-4 w-4 rotate-180" />
          Previous
        </span>
      )}

      <div className="flex items-center gap-1">
        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-primary-400">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={href(p)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm",
                p === page
                  ? "bg-surface font-semibold text-foreground"
                  : "text-primary-500 hover:bg-surface",
              )}
            >
              {p}
            </Link>
          ),
        )}
      </div>

      {page < totalPages ? (
        <Link
          href={href(page + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface"
        >
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary-300">
          Next
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
