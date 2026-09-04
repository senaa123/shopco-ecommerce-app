import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection (Next.js 16 renamed `middleware` -> `proxy`).
 *
 * - No `access_token` cookie on `/cart`, `/checkout`, `/orders` -> `/login`.
 * - `/admin/*` requires an `access_token` whose (unverified) JWT payload has
 *   `role === "ADMIN"`; otherwise -> `/` (or `/login` when logged out).
 *
 * The backend still enforces real auth on every request — this is only UX.
 */

const AUTH_REQUIRED = ["/cart", "/checkout", "/orders"];
const ADMIN_PREFIX = "/admin";

function decodeRole(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(json) as { role?: string };
    return data.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (decodeRole(token) !== "ADMIN") {
      const url = request.nextUrl.clone();
      url.pathname = token ? "/" : "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (AUTH_REQUIRED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/orders/:path*", "/admin/:path*"],
};
