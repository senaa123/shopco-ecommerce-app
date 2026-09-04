import { cn } from "@/lib/cn";

function Star({ fill }: { fill: number }) {
  // fill: 0..1 fraction of this star that is coloured
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <span className="relative inline-block h-4 w-4 shrink-0">
      <svg
        viewBox="0 0 20 20"
        className="absolute inset-0 h-4 w-4 text-primary-200"
        fill="currentColor"
        aria-hidden
      >
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
      </svg>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${clamped * 100}%` }}
      >
        <svg
          viewBox="0 0 20 20"
          className="h-4 w-4 text-[#FFC633]"
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      </span>
    </span>
  );
}

export function StarRating({
  rating,
  count,
  showValue = true,
  className,
}: {
  rating: number;
  count?: number;
  showValue?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} fill={rating - i} />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-primary-600">
          {rating.toFixed(1)}
          <span className="text-primary-400">/5</span>
        </span>
      )}
      {typeof count === "number" && (
        <span className="text-sm text-primary-400">({count})</span>
      )}
    </div>
  );
}
