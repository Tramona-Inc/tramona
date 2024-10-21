import { api } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateRange, formatCurrency } from "@/utils/utils";
import {
  User,
  Home,
  Calendar,
  CreditCard,
  ClipboardPlusIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OpenNewClaimForm from "./OpenNewClaimForm";
import { useState } from "react";

export default function AllPreviousTrips() {
  const { data: allPreviousTrips, isLoading } =
    api.trips.getAllPreviousTripsWithDetails.useQuery();

  const [isOpenClaimDialogOpen, setIsOpenClaimDialogOpen] = useState(false);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">All Previous Trips</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : allPreviousTrips && allPreviousTrips.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trip Details</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Stripe Info</TableHead>
                  <TableHead> Create an Incident </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allPreviousTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="primary" className="mb-1">
                          Trip ID: {trip.id}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Home className="mr-1 h-4 w-4" />
                          Property ID: {trip.property.id}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDateRange(trip.checkIn, trip.checkOut)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {trip.group.owner.name}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="mr-1 h-4 w-4" />
                          ID: {trip.group.owner.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatCurrency(trip.totalPriceAfterFees)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Offer ID: {trip.offerId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 tracking-tighter">
                        <div className="flex items-center text-sm">
                          <CreditCard className="mr-1 h-4 w-4" />
                          {trip.group.owner.setupIntentId}
                        </div>
                        <div className="flex items-center text-sm">
                          <CreditCard className="mr-1 h-4 w-4" />
                          {trip.group.owner.stripeCustomerId}
                        </div>
                        <div className="text-xs text-red-500">
                          This information will be removed for security reasons
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Dialog
                          open={isOpenClaimDialogOpen}
                          onOpenChange={setIsOpenClaimDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button className="w-full" variant="primary">
                              <ClipboardPlusIcon className="mr-1 h-4 w-4" />
                              Open Claim
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                          >
                            <OpenNewClaimForm
                              defaultTripId={trip.id}
                              defaultHostId={trip.group.owner.id}
                              superhogRequestId={
                                trip.superhogRequestId ?? undefined
                              }
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No previous trips found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
