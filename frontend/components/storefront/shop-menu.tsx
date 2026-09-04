"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/lib/api-types";
import { ChevronDownIcon } from "./icons";

export function ShopMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="flex items-center gap-1 text-sm text-foreground"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        Shop
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 z-50 mt-3 w-52 rounded-2xl border border-border bg-white p-2 shadow-lg">
          <Link
            href="/shop/all"
            className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-surface"
            onClick={() => setOpen(false)}
          >
            All products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="block rounded-xl px-3 py-2 text-sm hover:bg-surface"
              onClick={() => setOpen(false)}
            >
              {c.name}
            </Link>
          ))}
          {categories.length === 0 && (
            <p className="px-3 py-2 text-xs text-primary-400">
              No categories yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}
