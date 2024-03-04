import { useState, type PropsWithChildren } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { DatetimeFsp } from "drizzle-orm/mysql-core";

export default function RejectRequestDialog({
  children,
  requestId,
  requestCheckIn,
  requestCheckOut,
  userPhoneNumber,
  location

}: PropsWithChildren<{
    requestId: number,
    requestCheckIn: Date,
    requestCheckOut: Date,
    userPhoneNumber: string,
    location: string,
  }>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const utils = api.useUtils();
  const mutation = api.requests.resolve.useMutation();
  const twilioMutation = api.twilio.sendSMS.useMutation();


  async function rejectRequest() {
    setIsLoading(true);

    await mutation
      .mutateAsync({ id: requestId })
      .then(() => utils.requests.invalidate())
      .then(() => toast({ title: "Sucessfully rejected request" }))
      .catch(() => errorToast());

      const formattedCheckIn = new Date(requestCheckIn).toLocaleDateString('en-US', {
        month: 'short', // Short month name (e.g., "Feb")
        day: '2-digit', // Two-digit day (e.g., "27")
        year: 'numeric', // Full year (e.g., "2024")
      });

      const formattedCheckOut = new Date(requestCheckOut).toLocaleDateString('en-US', {
        month: 'short', // Short month name (e.g., "Feb")
        day: '2-digit', // Two-digit day (e.g., "27")
        year: 'numeric', // Full year (e.g., "2024")
      });

      await twilioMutation.mutateAsync({
        to: userPhoneNumber, // TODO: text the traveller, not the admin
        msg: `Tramona: Your request to ${location} on ${formattedCheckIn} - ${formattedCheckOut} has been rejected. Please submit another request with less requirements.`,
      });

    setIsLoading(false);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to reject this request?
          </DialogTitle>
          <DialogDescription>This can not be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={() => rejectRequest()}
            disabled={isLoading}
            className="rounded-full"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
