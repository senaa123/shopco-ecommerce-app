import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/storefront/auth-form";

export const metadata: Metadata = { title: "Log in — SHOP.CO" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
