import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/router";

interface OnlyOtherRequestsEmptyStateProps {
  firstCity: string;
}

export default function OnlyOtherRequestEmptyState({
  firstCity,
}: OnlyOtherRequestsEmptyStateProps) {
  const router = useRouter();
  return (
    <Card className="flex h-full items-center justify-center">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Home className="mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          No matching requests{" "}
        </h3>
        <p className="max-w-sm text-sm text-gray-500">
          There are no requests that match your property restrictions. Check the
          &quot;Other&quot; tab to view requests that are slightly outside your
          specified criteria - they might be a good fit!
        </p>
        <Button
          className="mt-4"
          variant="primary"
          onClick={() => router.push(`/host/requests/${firstCity}?option=other`)}
        >
          View other requests
        </Button>
      </CardContent>
    </Card>
  );
}
