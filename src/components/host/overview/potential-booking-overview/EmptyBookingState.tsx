import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmptyBookingState({
  type,
  isLoading,
}: {
  type: "city" | "property";
  isLoading: boolean;
}) {
  const isCityOverview = type === "city" ? true : false;

  return (
    <Card className="w-full border-primary/20">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-40" />
          </>
        ) : (
          <>
            <CheckCircle className="h-6 w-6 text-primary" />
            <p className="text-lg text-muted-foreground">
              You don&apos;t have any potential{" "}
              {isCityOverview ? "city" : "property"} bookings as of now
            </p>
            <Button variant="link" asChild>
              <Link href="/host/calendar">Edit Restrictions</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
