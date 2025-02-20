import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OnlyOtherRequestState() {
  return (
    <EmptyState icon={AlertCircle} className="h-[calc(100vh-280px)]">
      <EmptyStateTitle>No matching requests</EmptyStateTitle>
      <EmptyStateDescription>
        There are no requests that match your property restrictions. Check the
        &quot;Other&quot; tab to view requests that are slightly outside your
        specified criteria - they might be a good fit!
      </EmptyStateDescription>
      <EmptyStateFooter>
        <Button asChild variant="outline">
          <Link href="/host/requests/Dallas?option=other">
            View other requests
          </Link>{" "}
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
}
