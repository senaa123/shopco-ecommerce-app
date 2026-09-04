import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-[20px]" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-11 w-full rounded-pill" />
          <Skeleton className="h-11 w-full rounded-pill" />
        </div>
      </div>
    </div>
  );
}
