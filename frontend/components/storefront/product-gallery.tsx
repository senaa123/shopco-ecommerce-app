"use client";

import { useState } from "react";
import type { ProductImage as ProductImageType } from "@/lib/api-types";
import { cn } from "@/lib/cn";
import { ProductImage } from "./product-image";

export function ProductGallery({
  images,
  name,
}: {
  images: ProductImageType[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active]?.url ?? images[0]?.url ?? null;

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-2xl border sm:h-[110px] sm:w-[110px]",
                i === active ? "border-primary" : "border-transparent",
              )}
            >
              <ProductImage
                src={img.url}
                alt={`${name} thumbnail ${i + 1}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
      <ProductImage
        src={current}
        alt={name}
        className="aspect-square w-full flex-1 rounded-[20px]"
      />
    </div>
  );
}
