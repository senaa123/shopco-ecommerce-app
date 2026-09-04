"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";
import { CartIcon } from "./icons";

export function CartLink() {
  const count = useAuthStore((s) => s.cartCount);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative flex h-6 w-6 items-center justify-center text-foreground"
    >
      <CartIcon className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
