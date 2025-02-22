import { Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";

interface OnlyOtherRequestsEmptyStateProps {
  firstCity: string;
  otherRequestsCount: number;
}

export default function OnlyOtherRequestEmptyState({
  firstCity,
  otherRequestsCount,
}: OnlyOtherRequestsEmptyStateProps) {
  const router = useRouter();
  return (
    <Card className="flex h-full items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Home className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No requests match your price settings
        </h3>
        <div className="mb-4 rounded-lg bg-muted p-4">
          <p className="text-sm font-medium text-primary">
            However, there {otherRequestsCount === 1 ? "is" : "are"}{" "}
            {otherRequestsCount} request{otherRequestsCount !== 1 ? "s" : ""}{" "}
            slightly outside your price range
          </p>
        </div>
        <p className="mb-6 max-w-sm text-sm text-gray-500">
          These requests are just outside your specified price range. Consider
          reviewing them - they might still be a good match for your property!
        </p>
        <Button
          className="flex items-center gap-2"
          variant="primary"
          onClick={() =>
            router.push(`/host/requests/${firstCity}?option=other`)
          }
        >
          View requests outside price range
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
