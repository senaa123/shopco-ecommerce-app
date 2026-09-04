import type { ReactNode } from "react";

/**
 * Storefront (customer-facing) layout.
 *
 * Placeholder — global storefront chrome (header, footer, cart drawer) is added
 * in a later prompt.
 */
export default function StorefrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="flex min-h-full flex-col">{children}</div>;
}
