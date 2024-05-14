import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/utils/api";
import { formatCurrency, formatDateRange, getNumNights } from "@/utils/utils";
import { zodInteger } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Spinner from "../_common/Spinner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  counterPrice: zodInteger(),
});

export default function CounterForm({
  offerId,
  setOpen,
  counterNightlyPrice,
  previousOfferNightlyPrice,
  originalNightlyBiddingOffer,
}: {
  offerId: number;
  setOpen: (o: boolean) => void;
  counterNightlyPrice: number;
  previousOfferNightlyPrice: number;
  originalNightlyBiddingOffer: number;
}) {
  const { data: session } = useSession();
  const twilioMutation = api.twilio.sendSMS.useMutation();
  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

  const { data, isLoading } = api.biddings.getBidInfo.useQuery({
    bidId: offerId,
  });

  const { data: property } = api.properties.getById.useQuery({
    id: data?.propertyId,
  });

  const getTraveler = api.groups.getGroupOwner.useMutation();

  const { mutateAsync } = api.biddings.createCounter.useMutation({
    onSuccess: async () => {
      setOpen(false);

      console.log('Previous Offer Nightly Price:', previousOfferNightlyPrice);
      console.log('Counter Nightly Price:', counterNightlyPrice);
      // const guest = session?.user.role === "guest";
      // if (guest) { //send to host
      //   const traveler = session.user;
      //   if (traveler.phoneNumber) {
      //     if (traveler.isWhatsApp) {
      //       await twilioWhatsAppMutation.mutateAsync({
      //         templateId: "HXfeb90955f0801d551e95a6170a5cc015", //TO DO change template id - sasha
      //         to: traveler.phoneNumber,  //TO DO change to host phone number
      //       });
      //     } else {
      //       await twilioMutation.mutateAsync({
      //         to: traveler.phoneNumber, //TO DO change to host phone number
      //         msg: `Tramona: A traveler has countered your offer. Please go to www.tramona.com and respond to their counter.`,
      //       });
      //     }
      //   }
      // } else { //send to traveler
      //   const traveler = await getTraveler.mutateAsync( data?.madeByGroupId );
      //   if (traveler?.phoneNumber) {
      //     if (traveler.isWhatsApp) {
      //       await twilioWhatsAppMutation.mutateAsync({
      //         templateId: "HXfeb90955f0801d551e95a6170a5cc015", //TO DO change template id - sasha
      //         to: traveler.phoneNumber,
      //       });
      //     } else {
      //       if (!isLoading) {
      //         const nightlyPrice = previousOfferNightlyPrice > 0 ? formatCurrency(originalNightlyBiddingOffer) : formatCurrency(previousOfferNightlyPrice);
      //         await twilioMutation.mutateAsync({
      //           to: traveler.phoneNumber,
      //           msg: `Tramona: Your ${nightlyPrice}/night offer for ${property?.name} from ${formatDateRange(data?.checkIn, data?.checkOut)} has been counter offered by the host. The host proposed a price of ${formatCurrency(counterNightlyPrice)}/night. Please go to www.tramona.com and accept, reject or counter offer the host. You have 24 hours to respond.`,
      //         });
      //       }
      //     }
      //   }
      // }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      counterPrice: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (data && session) {
      const newCounter = {
        bidId: offerId,
        propertyId: data.propertyId,
        userId: session.user.id,
        counterAmount:
          values.counterPrice * getNumNights(data.checkIn, data.checkOut) * 100,
      };

      await mutateAsync(newCounter);

      const guest = session?.user.role === "guest";
      if (guest) { //send to host
        const traveler = session.user;
        if (traveler.phoneNumber) {
          if (traveler.isWhatsApp) {
            await twilioWhatsAppMutation.mutateAsync({
              templateId: "HXfeb90955f0801d551e95a6170a5cc015", //TO DO change template id - sasha
              to: traveler.phoneNumber,  //TO DO change to host phone number
            });
          } else {
            await twilioMutation.mutateAsync({
              to: traveler.phoneNumber, //TO DO change to host phone number
              msg: `Tramona: A traveler has countered your offer. Please go to www.tramona.com and respond to their counter.`,
            });
          }
        }
      } else { //send to traveler
        const traveler = await getTraveler.mutateAsync( data?.madeByGroupId );
        if (traveler?.phoneNumber) {
          const nightlyPrice = previousOfferNightlyPrice > 0 ? formatCurrency(previousOfferNightlyPrice) : formatCurrency(originalNightlyBiddingOffer);
          if (traveler.isWhatsApp) {
            await twilioWhatsAppMutation.mutateAsync({
              templateId: "HXa9200c7721c008928f1a932678727214",
              to: traveler.phoneNumber,
              cost: nightlyPrice,
              name: property?.name,
              dates: formatDateRange(data?.checkIn, data?.checkOut),
              counterCost: formatCurrency(counterNightlyPrice),
            });
          } else {
            if (!isLoading) {
              await twilioMutation.mutateAsync({
                to: traveler.phoneNumber,
                msg: `Tramona: Your ${nightlyPrice}/night offer for ${property?.name} from ${formatDateRange(data?.checkIn, data?.checkOut)} has been counter offered by the host. The host proposed a price of ${formatCurrency(counterNightlyPrice)}/night. Please go to www.tramona.com and accept, reject or counter offer the host. You have 24 hours to respond.`,
              });
            }
          }
        }
      }
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-5">
              <h1 className="">
                <span className="font-bold">Original Bidding offer: </span>
                {formatCurrency(originalNightlyBiddingOffer)}/night
              </h1>

              {previousOfferNightlyPrice > 0 && (
                <h1 className="">
                  <span className="font-bold">
                    Your Previous Counter offer:{" "}
                  </span>
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
            <FormField
              control={form.control}
              name="counterPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Counter Price</FormLabel>
                  <FormControl>
                    <Input {...field} prefix={"$"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant={"greenPrimary"}>
              Confirm Counter
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
