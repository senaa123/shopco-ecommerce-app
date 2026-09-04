"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  DRESS_STYLE_SLUGS,
  buildQueryString,
  titleCase,
  type RawSearchParams,
} from "@/lib/search-params";

/** Fixed product-type list backing the sidebar checkboxes. */
const PRODUCT_TYPES = ["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"];

const COLORS: { name: string; hex: string }[] = [
  { name: "Green", hex: "#00C12B" },
  { name: "Red", hex: "#F50606" },
  { name: "Yellow", hex: "#F5DD06" },
  { name: "Orange", hex: "#F57906" },
  { name: "Cyan", hex: "#06CAF5" },
  { name: "Blue", hex: "#063AF5" },
  { name: "Purple", hex: "#7D06F5" },
  { name: "Pink", hex: "#F506A4" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#0D0D0D" },
];

const SIZES = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const PRICE_MAX = 500;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border py-6">
      <h3 className="mb-4 text-lg font-bold">{title}</h3>
      {children}
    </div>
  );
}

export function FilterSidebar({
  category,
  searchParams,
}: {
  category: string;
  searchParams: RawSearchParams;
}) {
  const router = useRouter();
  const spString = (k: string) =>
    (Array.isArray(searchParams[k]) ? searchParams[k]?.[0] : searchParams[k]) ??
    "";

  // Everything below is local state, only committed when "Apply Filter" is
  // clicked (matching the Figma's single CTA).
  const [types, setTypes] = useState<string[]>(
    spString("types").split(",").map((t) => t.trim()).filter(Boolean),
  );
  const [minPrice, setMinPrice] = useState(Number(spString("minPrice")) || 0);
  const [maxPrice, setMaxPrice] = useState(
    Number(spString("maxPrice")) || PRICE_MAX,
  );
  const [color, setColor] = useState(spString("color"));
  const [size, setSize] = useState(spString("size"));
  const [dressStyle, setDressStyle] = useState(spString("dressStyle"));

  const currentDressSlug = DRESS_STYLE_SLUGS.includes(
    category.toLowerCase() as (typeof DRESS_STYLE_SLUGS)[number],
  )
    ? category.toLowerCase()
    : "";

  function toggleType(t: string) {
    setTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function apply() {
    const qs = buildQueryString(searchParams, {
      types: types.length > 0 ? types.join(",") : null,
      minPrice: minPrice > 0 ? minPrice : null,
      maxPrice: maxPrice < PRICE_MAX ? maxPrice : null,
      color: color || null,
      size: size || null,
      dressStyle: dressStyle || null,
      page: null,
    });
    router.push(`/shop/${category}${qs}`);
  }

  return (
    <aside className="rounded-[20px] border border-border p-5 lg:p-6">
      <h2 className="text-xl font-bold">Filters</h2>

      <div className="mt-4 border-t border-border pt-4">
        <ul className="flex flex-col gap-1">
          {PRODUCT_TYPES.map((t) => (
            <li key={t}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-primary-600 hover:bg-surface">
                <input
                  type="checkbox"
                  checked={types.includes(t)}
                  onChange={() => toggleType(t)}
                  className="h-4 w-4 accent-primary"
                />
                {t}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Section title="Price">
        <div className="flex items-center justify-between text-sm text-primary-600">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
        <label className="mt-3 block text-xs text-primary-400">
          Minimum
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            step={10}
            value={minPrice}
            onChange={(e) =>
              setMinPrice(Math.min(Number(e.target.value), maxPrice))
            }
            className="mt-1 w-full accent-primary"
          />
        </label>
        <label className="mt-2 block text-xs text-primary-400">
          Maximum
          <input
            type="range"
            min={0}
            max={PRICE_MAX}
            step={10}
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(Math.max(Number(e.target.value), minPrice))
            }
            className="mt-1 w-full accent-primary"
          />
        </label>
      </Section>

      <Section title="Colors">
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              aria-pressed={color === c.name}
              onClick={() => setColor(color === c.name ? "" : c.name)}
              className={cn(
                "h-9 w-9 rounded-full border",
                color === c.name
                  ? "border-primary ring-2 ring-primary/40"
                  : "border-border",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </Section>

      <Section title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(size === s ? "" : s)}
              className={cn(
                "rounded-pill px-4 py-2 text-sm",
                size === s
                  ? "bg-primary text-white"
                  : "bg-surface text-primary-600 hover:bg-surface-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Dress Style">
        <div className="flex flex-col gap-1">
          {DRESS_STYLE_SLUGS.map((slug) => {
            const label = titleCase(slug);
            const active =
              dressStyle === label || (!dressStyle && currentDressSlug === slug);
            return (
              <button
                key={slug}
                type="button"
                onClick={() => setDressStyle(dressStyle === label ? "" : label)}
                className={cn(
                  "rounded-lg px-2 py-2 text-left text-sm text-primary-600 hover:bg-surface",
                  active && "font-semibold text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Section>

      <Button fullWidth className="mt-2" onClick={apply}>
        Apply Filter
      </Button>
    </aside>
  );
}
