"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Hero photo (`frontend/public/hero.jpg`). If the file is ever missing the box
 * falls back to the hero's light-grey background so the section still reads.
 * The wrapper must be a positioned element (the caller passes `absolute` /
 * `relative`) so `next/image` can fill it.
 */
export function HeroImage({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("overflow-hidden bg-[#F2F0F1]", className)}>
      {!failed && (
        <Image
          src="/hero.jpg"
          alt="Two models wearing denim jackets over white hoodies"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="select-none object-cover object-[56%_top]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
