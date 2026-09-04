"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { logout as logoutRequest } from "@/lib/api";
import { cn } from "@/lib/cn";
import { selectIsAdmin, useAuthStore } from "@/lib/stores/auth-store";

const NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Orders", href: "/admin/orders" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore(selectIsAdmin);
  const hydrated = useAuthStore((s) => s.hydrated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Second safeguard — `proxy.ts` is the primary gate; this only catches an
  // edge case where a non-admin reaches the panel anyway.
  useEffect(() => {
    if (hydrated && !isAdmin) {
      router.replace(user ? "/" : "/login?redirect=/admin");
    }
  }, [hydrated, isAdmin, user, router]);

  async function handleLogout() {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
      router.push("/");
      router.refresh();
    }
  }

  // Once we know the user isn't an admin, stop rendering while the redirect runs.
  if (hydrated && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-primary-400">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-white md:flex">
        <div className="px-6 py-6">
          <Link href="/" className="font-display text-xl font-bold">
            SHOP.CO
          </Link>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-primary-400">
            Admin
          </p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-primary-600 hover:bg-surface",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-8">
          <div className="flex items-center gap-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-xs font-medium",
                  pathname === item.href ? "text-foreground" : "text-primary-400",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-primary-600">
              {user?.name ?? user?.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-pill border border-border px-4 py-1.5 text-sm font-medium hover:bg-surface"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
