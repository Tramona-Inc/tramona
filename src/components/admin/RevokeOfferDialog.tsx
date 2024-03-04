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
import { env } from "@/env";


export default function RevokeOfferDialog(
  props: PropsWithChildren<{
    requestId: number,
    requestCheckIn: Date;
    requestCheckOut: Date;
    propertyName: string;
    propertyAddress: string;
    userPhoneNumber: string;
    offerId: number;
    offerCount: number;
  }>,
) {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const mutation = api.offers.delete.useMutation();
  const twilioMutation = api.twilio.sendSMS.useMutation();


  async function deleteOffer() {
    await mutation
      .mutateAsync({ id: props.offerId })
      .then(() => utils.offers.invalidate())
      .then(() => toast({ title: "Sucessfully revoked offer" }))
      .catch(() => errorToast())
      .finally(() => setIsOpen(false));

      const formattedCheckIn = new Date(props.requestCheckIn).toLocaleDateString('en-US', {
        month: 'short', // Short month name (e.g., "Feb")
        day: '2-digit', // Two-digit day (e.g., "27")
        year: 'numeric', // Full year (e.g., "2024")
      });

      const formattedCheckOut = new Date(props.requestCheckOut).toLocaleDateString('en-US', {
        month: 'short', 
        day: '2-digit',
        year: 'numeric',
      });
      const url = `${env.NEXTAUTH_URL}/requests/${props.requestId}`


      props.offerCount >= 2 ?
        await twilioMutation.mutateAsync({
          to: props.userPhoneNumber,
          msg: `Tramona: Hello, your ${props.propertyName} in ${props.propertyAddress} offer from ${formattedCheckIn} - ${formattedCheckOut} has expired. Please visit the following URL in your browser to view your other offers: ${url}`,
        })
        :
        await twilioMutation.mutateAsync({
          to: props.userPhoneNumber,
          msg: `Tramona: Hello, your ${props.propertyName} in ${props.propertyAddress} offer from ${formattedCheckIn} - ${formattedCheckOut} has expired.`,
        })

  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to revoke this offer?</DialogTitle>
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
            onClick={() => deleteOffer()}
            disabled={mutation.isLoading}
            className="rounded-full"
          >
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
