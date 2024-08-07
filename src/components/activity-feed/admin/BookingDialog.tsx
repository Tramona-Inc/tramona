import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import CreateBookingForm from "./BookingForm";
import { type FeedItem } from "@/components/activity-feed/ActivityFeed";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { Button } from "@/components/ui/button";

export default function CreateBookingDialog({
  children,
  booking,
}: React.PropsWithChildren<{ booking?: FeedItem & { type: "booking" } }>) {
  const [isOpen, setIsOpen] = useState(false);
  const deleteFillerBooking = api.feed.deleteFillerBooking.useMutation();

  async function deleteBooking() {
    if (!booking) return;
    await deleteFillerBooking
      .mutateAsync({ id: booking.id })
      .then(() => toast({ title: "Sucessfully deleted booking" }))
      .catch(() => errorToast());
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="hidden" />
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {booking ? "Update" : "Create"} a filler booking{" "}
          </DialogTitle>
          <DialogDescription>
            {booking ? "Update" : "Create"} a filler booking
          </DialogDescription>
          <div className="flex flex-row justify-end">
            {booking && (
              <Button
                onClick={() => deleteBooking()}
                className="rounded-full"
                variant={"outline"}
              >
                Delete
              </Button>
            )}
          </div>
        </DialogHeader>
        <CreateBookingForm
          afterSubmit={() => setIsOpen(false)}
          booking={booking}
        />
      </DialogContent>
    </Dialog>
  );
}
