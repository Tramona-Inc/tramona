import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ConfirmationCardProps {
  action: string;
  title: string;
  href: string;
  className?: string;
  length: number;
}

export function NotificationCard({
  action = "Sync Calendar",
  title = "Sync Calendar",
  href = "#",
  length = 1,
  className = "",
}: ConfirmationCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="flex h-full min-h-[100px] flex-col gap-y-2 px-2 py-2 md:min-h-[180px]">
        <div className="flex h-full flex-col justify-between gap-y-2">
          <CardTitle className="flex flex-row items-center justify-between gap-x-2 text-xs font-semibold text-red-600 md:text-base">
            <div className="flex flex-row gap-x-2">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6" />
              Confirm important details
            </div>
            <div className="rounded-full border border-destructive px-2 text-xs text-destructive md:text-sm">
              {length}
            </div>
          </CardTitle>
          <p className="line-clamp-2 overflow-hidden text-ellipsis text-xs tracking-tight text-muted-foreground md:text-base">
            <span className="text-black">{action}</span> {title}
          </p>
          <Button asChild className="w-full" size="sm">
            <Link href={href} className="text-sm">
              Start
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationCardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-col items-start gap-5">
          {/* Icon skeleton */}
          <Skeleton className="h-7 w-7 rounded-full" />

          {/* Text Content skeleton */}
          <div className="w-full space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-7 w-1/2" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-[60px] w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
