import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <Skeleton className="mb-6 h-9 w-48" />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-[360px] rounded-[20px]" />
        <Skeleton className="h-[320px] rounded-[20px]" />
      </div>
    </div>
  );
}
