"use client";

import { useEffect } from "react";
import { getCart, getCurrentUser, getMyProfile } from "@/lib/api";
import { useAuthStore } from "./auth-store";

/**
 * Runs once on app load: calls `GET /auth/me` (a 401 is treated as
 * `user: null`, not an error) and seeds the Zustand auth store, plus the cart
 * count for a logged-in user.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setCartCount = useAuthStore((s) => s.setCartCount);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const user = await getCurrentUser();
      if (cancelled) return;
      setUser(user);

      if (user) {
        // /auth/me's JWT payload has no name — enrich from the profile endpoint.
        try {
          const profile = await getMyProfile();
          if (!cancelled) setUser({ ...user, name: profile.name });
        } catch {
          /* keep the payload-only user */
        }
        try {
          const cart = await getCart();
          if (!cancelled) setCartCount(cart.itemCount);
        } catch {
          /* ignore — cart is non-critical for bootstrap */
        }
      }
      if (!cancelled) setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [setUser, setCartCount, setHydrated]);

  return children;
}
