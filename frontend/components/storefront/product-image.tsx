/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/cn";

/**
 * Product image with a graceful grey fallback. Uses a plain <img> because
 * product image URLs are arbitrary (admin-entered) and not worth wiring through
 * `next/image` remote patterns for this scaffold.
 */
export function ProductImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-surface",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <span className="px-4 text-center text-xs font-medium text-primary-400">
          {alt}
        </span>
      )}
    </div>
  );
}
