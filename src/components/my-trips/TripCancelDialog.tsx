import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TicketXIcon } from "lucide-react";
import { checkCancellation } from "@/utils/cancellationLogic";
import InvalidTripCancellation from "./cancellationsCard/InvalidTripCancellation";
import TripCancellationOrPartialRefund from "./cancellationsCard/TripCancellationOrPartialRefund";
export default function TripCancelDialog({
  tripId,
  tripCancellation,
  checkIn,
  checkOut,
}: {
  tripId: number;
  tripCancellation: string;
  checkIn: Date;
  checkOut: Date;
}) {
  const { canCancel, partialRefund, numOfRefundableNights } = checkCancellation(
    {
      cancellationPolicy: tripCancellation,
      checkIn,
      checkOut,
    },
  );

  //if the trip is scraped or cannot cancell make it request cancellation.
  return (
    <Dialog>
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
          <TripCancellationOrPartialRefund tripId={tripId} />
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
