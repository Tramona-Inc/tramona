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

export default function PropertyDeclineDialog({
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
  const slackMutation = api.twilio.sendSlack.useMutation();

  // const getTraveler = api.groups.getGroupOwner.useMutation();
  const getTravelers = api.groups.getGroupMembers.useMutation();


  const { mutate } = api.biddings.reject.useMutation({
    onSuccess: async () => {
      toast({
        title: "Offer successfully rejected/declined",
      });

      if (!data || !property) return;

      const guest = session?.user.role === "guest";
      if (guest) {
        //admin temp message
        await slackMutation.mutateAsync({
          message: `Tramona: A traveler has declined your offer for ${property.name} from ${formatDateRange(data.checkIn, data.checkOut)}.`,
        });

        // const traveler = session.user;
        // if (traveler.phoneNumber) {
        //   if (traveler.isWhatsApp) {
        //     await twilioWhatsAppMutation.mutateAsync({
        //       templateId: "HXfeb90955f0801d551e95a6170a5cc015", //TO DO change template id - sasha
        //       to: traveler.phoneNumber, //TO DO change to host phone number
        //     });
        //   } else {
        //     await twilioMutation.mutateAsync({
        //       to: traveler.phoneNumber, //TO DO change to host phone number
        //       msg: `Tramona: Your ${formatCurrency(originalNightlyBiddingOffer)} offer for ${property.name} from ${formatDateRange(data?.checkIn, data?.checkOut)} has been counter offered by the host. The host proposed a price of ${formatCurrency(counterNightlyPrice)}. Please go to www.tramona.com and accept, reject or counter offer the host. You have 24 hours to respond.`,
        //     });
        //   }
        // }
      } else {
        //const traveler = await getTraveler.mutateAsync(data?.madeByGroupId);
        const travelers = await getTravelers.mutateAsync(data?.madeByGroupId);
        for (const traveler of travelers) {
          if (traveler.phoneNumber) {
            const nightlyPrice =
              counterNightlyPrice > 0
                ? formatCurrency(counterNightlyPrice)
                : formatCurrency(originalNightlyBiddingOffer);
            if (traveler.isWhatsApp) {
              await twilioWhatsAppMutation.mutateAsync({
                templateId: "HX74ffb496915d8e4ef39b41e624ca605e",
                to: traveler.phoneNumber,
                cost: nightlyPrice,
                name: property.name,
                dates: formatDateRange(data.checkIn, data.checkOut),
              });
            } else {
              await twilioMutation.mutateAsync({
                to: traveler.phoneNumber,
                msg: `Tramona: Your ${nightlyPrice}/night offer for ${property.name} from ${formatDateRange(data.checkIn, data.checkOut)} has been rejected by the host, visit Tramona.com to submit a new offer. Your card has not been charged.`,
              });
            }
          }
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
        <Button variant={"secondaryLight"}>Decline</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure you want to decline this offer?</DialogTitle>
        <p>You can not undo this action.</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button disabled={isLoading} onClick={handleDecline}>
            Decline Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
