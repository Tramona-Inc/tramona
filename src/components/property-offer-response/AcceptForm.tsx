import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/api";
import { formatCurrency, formatDateRange } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function AcceptForm({
  offerId,
  setOpen,
  counterNightlyPrice,
  totalCounterAmount,
  previousOfferNightlyPrice,
  originalNightlyBiddingOffer,
}: {
  offerId: number;
  setOpen: (open: boolean) => void;
  counterNightlyPrice: number;
  totalCounterAmount: number;
  previousOfferNightlyPrice: number;
  originalNightlyBiddingOffer: number;
}) {
  const { mutateAsync } = api.biddings.accept.useMutation();
  const { data: session } = useSession();
  const twilioMutation = api.twilio.sendSMS.useMutation();
  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();
  const slackMutation = api.twilio.sendSlack.useMutation();

  const { data: offer } = api.biddings.getBidInfo.useQuery({
    bidId: offerId,
  });

  const { data: property } = api.properties.getById.useQuery({
    id: offer?.propertyId ?? 0,
  });

  const getTravelers = api.groups.getGroupMembers.useMutation();

  async function onSubmit() {
    if (!offer || !property) return;
    void mutateAsync({ bidId: offerId, amount: totalCounterAmount });

    const guest = session?.user.role === "guest";
    const nightlyPrice =
      counterNightlyPrice > 0
        ? formatCurrency(counterNightlyPrice)
        : formatCurrency(originalNightlyBiddingOffer);
    if (guest) {
      //admin temp message
      await slackMutation.mutateAsync({
        message: `Tramona: A traveler has accepted your ${nightlyPrice}/night offer for ${property.name} from ${formatDateRange(offer.checkIn, offer.checkOut)}.`,
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
      //       msg: `Tramona: Your ${formatCurrency(previousOfferNightlyPrice)} offer for ${property.name} from ${formatDateRange(offer.checkIn, offer.checkOut)} has been counter offered by the host. The host proposed a price of ${formatCurrency(counterNightlyPrice)}. Please go to www.tramona.com and accept, reject or counter offer the host. You have 24 hours to respond.`,
      //     });
      //   }
      // }
    } else {
      const travelers = await getTravelers.mutateAsync(offer.madeByGroupId);
      for (const traveler of travelers) {
        if (traveler.phoneNumber) {
          if (traveler.isWhatsApp) {
            await twilioWhatsAppMutation.mutateAsync({
              templateId: "HX28c41122cfa312e326a9b5fc5e7bc255",
              to: traveler.phoneNumber,
              cost: nightlyPrice,
              name: property.name,
              dates: formatDateRange(offer.checkIn, offer.checkOut),
            });
          } else {
            await twilioMutation.mutateAsync({
              to: traveler.phoneNumber,
              msg: `Tramona: Congratulations! Your ${nightlyPrice}/night offer for ${property.name} from ${formatDateRange(offer.checkIn, offer.checkOut)} has been accepted by the host and your stay has been booked. Please visit the My Trips page at Tramona.com to view `,
            });
          }
        }
      }
    }

    setOpen(false);
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <h1 className="">
            <span className="font-bold">Original Bidding offer: </span>
            {formatCurrency(originalNightlyBiddingOffer)}/night
          </h1>

          {previousOfferNightlyPrice > 0 && (
            <h1 className="">
              <span className="font-bold">Your Previous Counter offer: </span>
              {formatCurrency(previousOfferNightlyPrice)}/night
            </h1>
          )}

          {counterNightlyPrice > 0 && (
            <>
              <Separator />
              <h1>
                <span className="font-bold">
                  {session?.user.role === "guest" ? "Host" : "Traveller"}{" "}
                  Counter offer:{" "}
                </span>
                {formatCurrency(counterNightlyPrice)}/night
              </h1>
            </>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button type="submit" className="w-full" variant={"greenPrimary"}>
              Accept Offer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You are agreeing to accepting the current bid price.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onSubmit}>
                Accept Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
