"use client";

import { create } from "zustand";
import type { AuthUser } from "@/lib/api-types";

interface AuthStore {
  user: AuthUser | null;
  cartCount: number;
  /** True once the initial GET /auth/me has resolved (see AuthBootstrap). */
  hydrated: boolean;

  setUser: (user: AuthUser | null) => void;
  setCartCount: (count: number) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  cartCount: 0,
  hydrated: false,

  setUser: (user) => set({ user }),
  setCartCount: (cartCount) => set({ cartCount: Math.max(0, cartCount) }),
  clearAuth: () => set({ user: null, cartCount: 0 }),
  setHydrated: (hydrated) => set({ hydrated }),
}));

/** Convenience selectors. */
export const selectIsAuthenticated = (s: AuthStore) => s.user !== null;
export const selectIsAdmin = (s: AuthStore) => s.user?.role === "ADMIN";
