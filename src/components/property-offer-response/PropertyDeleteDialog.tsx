//for an accepted property that needs to be withdrawn due to scheduling mistake by host

import { api } from "@/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import { formatCurrency, formatDateRange } from "@/utils/utils";

export default function PropertyDeleteDialog({
  offerId,
  open,
  onOpenChange,
  originalNightlyBiddingOffer,
  counterNightlyPrice,
}: {
  offerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalNightlyBiddingOffer: number;
  counterNightlyPrice: number;
}) {
  const { data: session } = useSession();
  const twilioMutation = api.twilio.sendSMS.useMutation();
  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

  const { data, isLoading } = api.biddings.getBidInfo.useQuery({
    bidId: offerId,
  });

  // TODO: fix jank fetching on this and the other ones
  const { data: property } = api.properties.getById.useQuery({
    id: data?.propertyId ?? 0,
  });

  const getTraveler = api.groups.getGroupOwner.useMutation();

  const { mutate } = api.biddings.cancel.useMutation({
    onSuccess: async () => {
      toast({
        title: "Offer successfully cancelled",
      });

      if (!data || !property) return;

      const traveler = await getTraveler.mutateAsync(data?.madeByGroupId);
      if (traveler?.phoneNumber) {
        const nightlyPrice =
          counterNightlyPrice > 0
            ? formatCurrency(counterNightlyPrice)
            : formatCurrency(originalNightlyBiddingOffer);
        if (traveler.isWhatsApp) {
          await twilioWhatsAppMutation.mutateAsync({
            templateId: "HX74ffb496915d8e4ef39b41e624ca605e",     //fix this template id
            to: traveler.phoneNumber,
            cost: nightlyPrice,
            name: property?.name,
            dates: formatDateRange(data?.checkIn, data?.checkOut),
          });
        } else {
          await twilioMutation.mutateAsync({
            to: traveler.phoneNumber,
            msg: `Tramona: Your ${nightlyPrice}/night offer for ${property.name} from ${formatDateRange(data.checkIn, data.checkOut)} has been canceled. A full refund will be coming your way shortly. Please visit Tramona.com to submit a new request or place new offers`,
          });
        }
      }
    },
  });

  function handleDecline() {
    mutate({ bidId: offerId });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button variant={"secondaryLight"}>Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure you want to withdraw this offer?</DialogTitle>
        <p>
          Your offer will be permanently withdrawn. You can not undo this
          action.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleDecline}>Withdraw Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
