"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Paginated, Product, Review } from "@/lib/api-types";
import { ProductReviews } from "./product-reviews";

const TABS = ["Product Details", "Rating & Reviews", "FAQs"] as const;
type Tab = (typeof TABS)[number];

const FAQS = [
  {
    q: "What sizes are available?",
    a: "Available sizes are listed on the product page. Refer to the size guide if you're between sizes.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 3–5 business days. A flat $15 fee applies, and it's free for orders over $200.",
  },
  {
    q: "What is the return policy?",
    a: "Unworn items can be returned within 14 days of delivery for a full refund.",
  },
];

export function ProductTabs({
  product,
  reviews,
}: {
  product: Product;
  reviews: Paginated<Review>;
}) {
  const [tab, setTab] = useState<Tab>("Rating & Reviews");

  return (
    <div className="mt-14">
      <div className="flex border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 pb-4 text-center text-sm sm:text-base",
              tab === t
                ? "border-b-2 border-primary font-medium text-foreground"
                : "text-primary-400",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="py-8">
        {tab === "Product Details" && (
          <div className="space-y-4 text-sm leading-7 text-primary-600">
            <p>{product.description}</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {product.category && (
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">Category</dt>
                  <dd>{product.category.name}</dd>
                </div>
              )}
              {product.dressStyle && (
                <div className="flex gap-2">
                  <dt className="font-medium text-foreground">Dress style</dt>
                  <dd>{product.dressStyle}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="font-medium text-foreground">Available colors</dt>
                <dd>
                  {[...new Set(product.variants.map((v) => v.color))].join(
                    ", ",
                  ) || "—"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-foreground">Available sizes</dt>
                <dd>
                  {[...new Set(product.variants.map((v) => v.size))].join(
                    ", ",
                  ) || "—"}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {tab === "Rating & Reviews" && (
          <ProductReviews productId={product.id} initial={reviews} />
        )}

        {tab === "FAQs" && (
          <div className="divide-y divide-border">
            {FAQS.map((f) => (
              <div key={f.q} className="py-4">
                <h4 className="font-medium text-foreground">{f.q}</h4>
                <p className="mt-1 text-sm text-primary-500">{f.a}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
