"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout as logoutRequest } from "@/lib/api";
import { selectIsAuthenticated, useAuthStore } from "@/lib/stores/auth-store";
import { UserIcon } from "./icons";

export function AccountMenu() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    try {
      await logoutRequest();
    } finally {
      clearAuth();
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Account menu"
        className="flex h-6 w-6 items-center justify-center text-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        <UserIcon className="h-6 w-6" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-48 rounded-2xl border border-border bg-white p-2 shadow-lg">
          {isAuthenticated ? (
            <>
              <p className="truncate px-3 py-2 text-xs text-primary-400">
                {user?.email}
              </p>
              <Link
                href="/orders"
                className="block rounded-xl px-3 py-2 text-sm hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
              <button
                type="button"
                className="block w-full rounded-xl px-3 py-2 text-left text-sm text-sale hover:bg-surface"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block rounded-xl px-3 py-2 text-sm hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block rounded-xl px-3 py-2 text-sm hover:bg-surface"
                onClick={() => setOpen(false)}
              >
                Create account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
