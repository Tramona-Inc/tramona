import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface ConfirmationCardProps {
  title: string;
  href: string;
  className?: string;
}

export function NotificationCard({
  title = "Sync Calendar",
  href = "#",
  className = "",
}: ConfirmationCardProps) {
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardContent className="flex h-full min-h-[100px] flex-col gap-y-2 px-2 py-2 md:min-h-[200px]">
        <div className="flex-1 space-y-4">
          <AlertCircle className="h-5 w-5" />
          <div className="space-y-2">
            <CardTitle className="text-base font-semibold">
              Confirm important details
            </CardTitle>
            <p className="text-base">{title}</p>
          </div>
        </div>

        <Button asChild className="w-full" size="sm">
          <Link href={href}>Start</Link>
        </Button>
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
