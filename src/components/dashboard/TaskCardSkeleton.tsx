import { Skeleton } from "@/components/ui/Skeleton";

export function TaskCardSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface-raised border border-surface-border rounded-card">
      <Skeleton className="w-2 h-2 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-20 rounded-pill" />
      <Skeleton className="h-3 w-12 hidden sm:block" />
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
  );
}