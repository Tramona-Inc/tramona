import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Property } from "@/server/db/schema/tables/properties";
import {
  formatCurrency,
  formatDateRange,
  getHostPayout,
  getNumNights,
  getTravelerOfferedPrice,
  plural,
} from "@/utils/utils";
import { HOST_MARKUP, TRAVELER__MARKUP } from "@/utils/constants";
import Image from "next/image";
import { EllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { HostDashboardRequestToBook } from "@/components/requests-to-book/RequestToBookCard";

export default function HostConfirmRequestToBookDialog({
  open,
  setOpen,
  requestToBook,
  property,
  setStep,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestToBook: HostDashboardRequestToBook;
  property: Property & { taxAvailable: boolean };
  setStep: (step: number) => void;
}) {
  const { toast } = useToast();
  const slackMutation = api.twilio.sendSlack.useMutation();

  const createOffersMutation = api.offers.create.useMutation();

  const handleSubmit = async () => {
    const cityWithNoTax = !property.taxAvailable ? property.city : null;
    const propertyWithTax = property.taxAvailable ? property : null;

    if (propertyWithTax) {
      try {
        await createOffersMutation.mutateAsync({
          requestId: requestToBook.id,
          propertyId: propertyWithTax.id,
          totalPrice: parseInt(fmtdNightlyPrice) * 100 * numNights,
          hostPayout:
            getHostPayout({
              propertyPrice: parseFloat(fmtdNightlyPrice),
              hostMarkup: HOST_MARKUP,
              numNights,
            }) * 100,
          travelerOfferedPriceBeforeFees:
            getTravelerOfferedPrice({
              propertyPrice: parseFloat(fmtdNightlyPrice),
              travelerMarkup: TRAVELER__MARKUP,
              numNights,
            }) * 100,
        });

        setStep(2);
      } catch (error) {
        console.log("Error", error);
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        setStep(1);
      }
    } else if (cityWithNoTax) {
      toast({
        title: "Error Creating Offers",
        description: [
          `We do not currently have taxes set up for:`,
          `${cityWithNoTax}`,
          `A request for this location tax to be configured has been sent. Keep an eye on your offer details for updates! `,
        ].join("\n"),
        variant: "destructive",
      });

      await slackMutation.mutateAsync({
        isProductionOnly: false,
        message: [
          `Tramona: A host tried to create an offer without tax for the following locations: ${cityWithNoTax}.`,
          `Property Ids: ${property.id}`,
        ].join("\n"),
      });
      setStep(1);
    } else {
      errorToast();
      setStep(1);
    }
  };

  const fmtdNightlyPrice = // requestToBook.maxTotalPrice /
    (
      12345 /
      getNumNights(requestToBook.checkIn, requestToBook.checkOut) /
      100
    ).toFixed(2);

  const numNights = getNumNights(requestToBook.checkIn, requestToBook.checkOut);
  // console.log("filteredSelectedProperties2", filteredSelectedProperties);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <h3 className="text-center text-lg font-bold">Respond</h3>
        </DialogHeader>
        <DialogDescription>
          Please confirm the booking details below.
        </DialogDescription>
        <div className="rounded-md border bg-gray-50 p-4">
          <div className="mb-4 flex justify-between">
            <div className="flex flex-col items-start">
              <div className="text-dark text-lg font-bold">
                {/* {formatCurrency(request.maxTotalPrice / numNights)} */}12345
                /night
              </div>
              <div className="text-sm text-gray-600">
                {/* {formatCurrency(request.maxTotalPrice)}  */}34567 total
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-dark text-lg font-bold">
                {formatDateRange(requestToBook.checkIn, requestToBook.checkOut)}
              </div>
              <div className="text-sm text-gray-600">
                {plural(numNights, "night")}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-dark text-lg font-bold">
                {plural(requestToBook.numGuests, "guest")}
              </div>
            </div>
          </div>
          {/* {requestToBook.note && (
            <div className="rounded-md bg-gray-100 p-2">
              <div className="text-sm text-gray-700">{requestToBook.note}</div>
            </div>
          )} */}
        </div>

        <h4 className="text-dark text-lg font-bold">Review booking</h4>

        <div
          key={property.id}
          className="flex flex-col rounded-md border bg-white p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={property.imageUrls[0] ?? ""}
                alt={property.name}
                width={60}
                height={60}
                className="rounded"
              />
              <div className="flex flex-col">
                <div className="text-dark text-sm font-semibold">
                  {property.name}
                </div>
                <div className="text-sm text-gray-600">{property.city}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="rounded-md bg-gray-100 p-2">
              <div className="text-dark text-sm font-semibold">
                Your offer: ${fmtdNightlyPrice} / night
              </div>
              <div className="text-sm text-gray-600">
                Total payout: $
                {getHostPayout({
                  propertyPrice: parseFloat(fmtdNightlyPrice),
                  hostMarkup: HOST_MARKUP,
                  numNights: getNumNights(
                    requestToBook.checkIn,
                    requestToBook.checkOut,
                  ),
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="justify-between">
          <Button variant="secondary" onClick={() => setStep(0)}>
            Back
          </Button>
          <Button onClick={handleSubmit}>Accept Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
