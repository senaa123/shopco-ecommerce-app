import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1 text-sm", className)}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !isLast ? (
              <Link href={item.href} className="text-primary-400 hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground" : "text-primary-400"}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className="text-primary-300" aria-hidden>
                &rsaquo;
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
