import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-pill" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-1.5 w-full rounded-pill" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}