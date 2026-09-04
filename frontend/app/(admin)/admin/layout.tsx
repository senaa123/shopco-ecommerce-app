import type { ReactNode } from "react";

/**
 * Admin dashboard layout.
 *
 * Placeholder — auth guard, sidebar navigation and admin chrome are added in a
 * later prompt.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-full flex-col bg-surface">{children}</div>;
}
