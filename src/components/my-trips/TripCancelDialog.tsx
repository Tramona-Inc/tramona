import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TicketXIcon } from "lucide-react";
import { checkCancellation } from "@/utils/cancellationLogic";
import InvalidTripCancellation from "./cancellationsCard/InvalidTripCancellation";
import TripCancellationOrPartialRefund from "./cancellationsCard/TripCancellationOrPartialRefund";
import { useState } from "react";
import { Property, Trip } from "@/server/db/schema";

export default function TripCancelDialog({
  trip,
}: {
  trip: Pick<
    Trip,
    "id" | "checkIn" | "checkOut" | "createdAt" | "totalPriceAfterFees"
  > & {
    property: Pick<
      Property,
      "cancellationPolicy" | "checkInTime" | "checkOutTime"
    >;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    canCancel,
    partialRefund,
    partialRefundPercentage,
    description,
    cancellationFee,
  } = checkCancellation(trip);

  //if the trip is scraped or cannot cancell make it request cancellation.
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="primary">
          <TicketXIcon className="" />
          Cancel Trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* Tramona's property or is valid */}
        {/* partial refund */}

        {canCancel || partialRefund ? (
          <TripCancellationOrPartialRefund
            tripId={trip.id}
            partialRefundPercentage={partialRefundPercentage}
            description={description}
            totalPriceAfterFees={trip.totalPriceAfterFees}
            setClose={() => setIsOpen(false)}
            cancellationFee={cancellationFee}
          />
        ) : (
          <InvalidTripCancellation
            tripId={trip.id}
            cancellationPolicy={trip.property.cancellationPolicy!}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
