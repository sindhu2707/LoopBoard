import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export function StatsRowSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-7 w-12" />
        </Card>
      ))}
    </div>
  );
}