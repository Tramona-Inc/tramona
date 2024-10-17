import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TicketXIcon } from "lucide-react";
import { checkCancellation } from "@/utils/cancellationLogic";
import InvalidTripCancellation from "./cancellationsCard/InvalidTripCancellation";
import TripCancellationOrPartialRefund from "./cancellationsCard/TripCancellationOrPartialRefund";
import { useState } from "react";

export default function TripCancelDialog({
  tripId,
  tripCancellation,
  checkInDate,
  checkOutDate,
  bookingDate,
  checkInTime,
  checkOutTime,
  totalPriceAfterFees,
}: {
  tripId: number;
  tripCancellation: string;
  checkInDate: Date;
  checkOutDate: Date;
  bookingDate: Date;
  checkInTime: string;
  checkOutTime: string;
  totalPriceAfterFees: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { canCancel, partialRefund, partialRefundPercentage, description } =
    checkCancellation({
      cancellationPolicy: tripCancellation,
      checkInDate,
      checkOutDate,
      checkInTime,
      checkOutTime,
      bookingDate: bookingDate,
    });

  //if the trip is scraped or cannot cancell make it request cancellation.
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="secondary">
          <TicketXIcon className="" />
          Cancel Trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        {/* Tramona's property or is valid */}
        {/* partial refund */}

        {canCancel || partialRefund ? (
          <TripCancellationOrPartialRefund
            tripId={tripId}
            partialRefundPercentage={partialRefundPercentage}
            description={description}
            totalPriceAfterFees={totalPriceAfterFees}
            setClose={() => setIsOpen(false)}
          />
        ) : (
          <InvalidTripCancellation
            tripId={tripId}
            cancellationPolicy={tripCancellation}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
