import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { HandshakeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyRequestState() {
  return (
    <EmptyState icon={HandshakeIcon} className="h-[calc(100vh-280px)]">
      <EmptyStateTitle>No requests yet</EmptyStateTitle>
      <EmptyStateDescription>
        Properties with requests will show up here
      </EmptyStateDescription>
      <EmptyStateFooter>
        <Button asChild variant="outline">
          <Link href="/host/properties">View all properties</Link>
        </Button>
      </EmptyStateFooter>
    </EmptyState>
  );
}
