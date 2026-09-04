"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, getCart, login, register } from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth-store";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const setCartCount = useAuthStore((s) => s.setCartCount);
  const explicitRedirect = params.get("redirect");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result =
        mode === "login"
          ? await login({ email: form.email, password: form.password })
          : await register(form);

      // Update the store before navigating so the Navbar reflects the logged-in
      // state immediately, without a full reload.
      setUser(result.user);
      try {
        const cart = await getCart();
        setCartCount(cart.itemCount);
      } catch {
        /* ignore */
      }

      // Admins land on the admin panel unless a specific redirect was requested.
      const destination =
        explicitRedirect ??
        (result.user.role === "ADMIN" ? "/admin" : "/");
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl">
        {mode === "login" ? "Log in" : "Create account"}
      </h1>
      <p className="mt-1 text-sm text-primary-400">
        {mode === "login"
          ? "Welcome back to SHOP.CO."
          : "Sign up and get 20% off your first order."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3">
        {mode === "register" && (
          <Input
            required
            placeholder="Full name"
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
          />
        )}
        <Input
          required
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={set("email")}
          autoComplete="email"
        />
        <Input
          required
          type="password"
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={set("password")}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        {error && <p className="text-sm text-sale">{error}</p>}
        <Button type="submit" size="lg" fullWidth disabled={submitting}>
          {submitting
            ? "Please wait…"
            : mode === "login"
              ? "Log in"
              : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-primary-500">
        {mode === "login" ? (
          <>
            New to SHOP.CO?{" "}
            <Link href="/register" className="font-medium text-foreground underline">
              Create an account
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-foreground underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
