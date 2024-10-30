import { api } from "@/utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/utils";

export default function AllClaimItems() {
  const { data: allClaimItems, isLoading } =
    api.trips.getAllclaimItems.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!allClaimItems || allClaimItems.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No claim items found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trip ID</TableHead>
          <TableHead>Requested Amount</TableHead>
          <TableHead>Outstanding Amount</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allClaimItems.map((trip) => (
          <TableRow key={trip.tripId}>
            <TableCell>{trip.tripId}</TableCell>
            <TableCell>{formatCurrency(trip.requestedAmount)}</TableCell>
            <TableCell>
              {formatCurrency(
                trip.outstandingAmount ? trip.outstandingAmount : 0,
              )}
            </TableCell>
            <TableCell>
              {trip.paymentCompleteAt
                ? `Completed on ${trip.paymentCompleteAt.toLocaleDateString()}`
                : "Not completed"}
            </TableCell>
            <TableCell>{trip.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
