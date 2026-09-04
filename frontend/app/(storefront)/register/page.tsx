import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/storefront/auth-form";

export const metadata: Metadata = { title: "Create account — SHOP.CO" };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}
