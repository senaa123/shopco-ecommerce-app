import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <Skeleton className="mb-5 h-4 w-40" />
      <div className="grid gap-6 lg:grid-cols-[295px_1fr]">
        <Skeleton className="h-[640px] rounded-[20px]" />
        <div>
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-6 w-52" />
          </div>
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
