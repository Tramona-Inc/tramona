import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import { type Property } from "@/server/db/schema/tables/properties";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { TRAVELER_MARKUP } from "@/utils/constants";
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
import {
  baseAmountToHostPayout,
  getTravelerOfferedPrice,
} from "@/utils/payment-utils/paymentBreakdown";
import OfferPriceBreakdown from "./requests/pricebreakdown/OfferPricebreakdown";

export default function HostConfirmRequestDialog({
  open,
  setOpen,
  request,
  properties,
  setPropertyPrices,
  propertyPrices,
  setStep,
  selectedProperties,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: HostDashboardRequest;
  properties: (Property & { taxAvailable: boolean })[];
  setPropertyPrices: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  propertyPrices: Record<number, string>;
  setStep: (step: number) => void;
  selectedProperties: number[];
}) {
  //propertyPrices == base prices

  console.log(propertyPrices);
  const { toast } = useToast();
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState<
    number | null
  >(null);
  const [editValue, setEditValue] = useState<string>("");
  const slackMutation = api.twilio.sendSlack.useMutation();

  const handleEdit = (id: number) => {
    setSelectedPropertyToEdit(id);
    setEditValue(propertyPrices[id] ?? ""); // Initialize the edit value with the current price
  };
  const createOffersMutation = api.offers.create.useMutation();

  const handleRemove = (id: number) => {
    setPropertyPrices((prev: Record<number, string>) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handlePriceChange = (id: number, value: string) => {
    setPropertyPrices({
      ...propertyPrices,
      [id]: value,
    });
  };

  const filteredProperties = properties.filter((property) =>
    selectedProperties.includes(property.id),
  );

  const filteredSelectedProperties = filteredProperties.filter((property) =>
    propertyPrices.hasOwnProperty(property.id),
  );

  // const handleSubmit = async () => {
  //   const propertiesWithNoTax = filteredSelectedProperties
  //     .filter((property) => !property.taxAvailable)
  //     .map((property) => property.city); // List cities of properties without tax

  //   const propertiesWithTax = filteredSelectedProperties.filter(
  //     (property) => property.taxAvailable,
  //   );

  //   await Promise.all(
  //     // todo: make procedure accept array
  //     propertiesWithTax.map(async (property) => {
  //       const totalBasePriceBeforeFees =
  //         parseInt(propertyPrices[property.id] ?? "0") * 100 * numNights;

  //       await createOffersMutation
  //         .mutateAsync({
  //           requestId: request.id,
  //           propertyId: property.id,
  //           totalBasePriceBeforeFees: totalBasePriceBeforeFees,
  //           hostPayout: getHostPayout(totalBasePriceBeforeFees),
  //           calculatedTravelerPrice: getTravelerOfferedPrice({
  //             totalBasePriceBeforeFees,
  //             travelerMarkup: TRAVELER_MARKUP,
  //           }),
  //         })
  //         .catch((error) => {
  //           console.log("Error", error);
  //           if (error instanceof Error) {
  //             toast({
  //               title: "Error",
  //               description: error.message,
  //               variant: "destructive",
  //             });
  //           }
  //         });
  //     }),
  //   )
  //     .then(async () => {
  //       if (propertiesWithNoTax.length === 0) {
  //         // All properties had tax set up, proceed to step 2
  //         setStep(2);
  //       } else {
  //         // Some properties did not have tax set up, show popup
  //         toast({
  //           title: "Error Creating Offers",
  //           description: [
  //             `We do not currently have taxes set up for these locations:`,
  //             `${propertiesWithNoTax.join(", ")}`,
  //             `A request for this location tax to be configured has been sent. Keep an eye on your offer details for updates! `,
  //           ].join("\n"),

  //           variant: "destructive",
  //         });
  //         //send slack
  //         await slackMutation.mutateAsync({
  //           isProductionOnly: false,
  //           message: [
  //             `Tramona: A host tried to create an offer without tax for the following locations: ${propertiesWithNoTax.join(", ")}.`,
  //             `Property Ids: ${properties.map((p) => p.id).join(", ")}`,
  //           ].join("\n"),
  //         });
  //         setStep(1); // Reset the step to 1 if some properties failed
  //       }
  //     })
  //     .catch(() => {
  //       errorToast();
  //       setStep(1);
  //     });
  // };

  const handleSubmit = async () => {
    const propertiesWithNoTax = filteredSelectedProperties
      .filter((property) => !property.taxAvailable)
      .map((property) => property.city); // List cities of properties without tax

    const propertiesWithTax = filteredSelectedProperties.filter(
      (property) => property.taxAvailable,
    );

    try {
      const results = await Promise.allSettled(
        propertiesWithTax.map(async (property) => {
          const totalBasePriceBeforeFees =
            parseFloat(propertyPrices[property.id] ?? "0") * 100 * numNights;

          console.log(propertyPrices[property.id] ?? "0");
          console.log(totalBasePriceBeforeFees); // should be 92.5
          console.log(baseAmountToHostPayout(totalBasePriceBeforeFees)); //should be 90.19

          return createOffersMutation.mutateAsync({
            requestId: request.id,
            propertyId: property.id,
            totalBasePriceBeforeFees: totalBasePriceBeforeFees,
            hostPayout: baseAmountToHostPayout(totalBasePriceBeforeFees),
            calculatedTravelerPrice: getTravelerOfferedPrice({
              totalBasePriceBeforeFees,
            }),
          });
        }),
      );

      const failedProperties = propertiesWithTax.filter(
        (_, index) => results[index]?.status === "rejected",
      );

      if (propertiesWithTax.length === 1 && failedProperties.length > 0) {
        // Single property and it failed
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const error =
          results[0]?.status === "rejected" ? results[0].reason : undefined;
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        setStep(1);
        return; // Exit early
      }

      if (failedProperties.length > 0) {
        toast({
          title: "Partial Failure",
          description: `Some offers could not be created. Please check the logs or contact support.`,
          variant: "destructive",
        });
      }

      if (propertiesWithNoTax.length === 0) {
        // All properties had tax set up, proceed to step 2
        setStep(2);
      } else {
        // Some properties did not have tax set up, show popup
        toast({
          title: "Error Creating Offers",
          description: [
            `We do not currently have taxes set up for these locations:`,
            `${propertiesWithNoTax.join(", ")}`,
            `A request for this location tax to be configured has been sent. Keep an eye on your offer details for updates!`,
          ].join("\n"),
          variant: "destructive",
        });
        // Send Slack notification
        await slackMutation.mutateAsync({
          isProductionOnly: false,
          message: [
            `Tramona: A host tried to create an offer without tax for the following locations: ${propertiesWithNoTax.join(", ")}.`,
            `Property Ids: ${propertiesWithNoTax.join(", ")}`,
          ].join("\n"),
        });
        setStep(1); // Reset the step to 1 if some properties failed
      }
    } catch (error) {
      console.log("Critical error during offer creation", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setStep(1); // Reset the step to 1 on failure
    }
  };

  const numNights = getNumNights(request.checkIn, request.checkOut);
  const requestNightlyPriceCents = request.maxTotalPrice / numNights;
  // console.log("filteredSelectedProperties2", filteredSelectedProperties);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <h3 className="text-center text-lg font-bold">Respond</h3>
        </DialogHeader>
        <DialogDescription>
          Please confirm the properties you would like to offer.
        </DialogDescription>
        <div className="rounded-md border bg-gray-50 p-4">
          <div className="mb-4 flex justify-between">
            <div className="flex flex-col items-start">
              <div className="text-dark text-lg font-bold">
                {formatCurrency(requestNightlyPriceCents)}
                /night
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(request.maxTotalPrice)} total
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-dark text-lg font-bold">
                {formatDateRange(request.checkIn, request.checkOut)}
              </div>
              <div className="text-sm text-gray-600">
                {plural(numNights, "night")}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-dark text-lg font-bold">
                {plural(request.numGuests, "guest")}
              </div>
            </div>
          </div>
          {request.note && (
            <div className="rounded-md bg-gray-100 p-2">
              <div className="text-sm text-gray-700">{request.note}</div>
            </div>
          )}
        </div>

        <h4 className="text-dark text-lg font-bold">Review your offers</h4>

        <div className="space-y-4">
          {filteredSelectedProperties.map((property) => {
            const nightlyPriceCents =
              parseFloat(propertyPrices[property.id] ?? "0") * 100;
            const totalBasePriceBeforeFeesCents = nightlyPriceCents * numNights;
            const hostPayoutCents = baseAmountToHostPayout(
              totalBasePriceBeforeFeesCents,
            );

            const editNightlyPriceCents = parseFloat(editValue) * 100;

            return (
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
                      <div className="text-sm text-gray-600">
                        {property.city}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <EllipsisIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(property.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemove(property.id)}
                        className="text-red-600"
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {selectedPropertyToEdit === property.id ? (
                  <div className="flex flex-col space-y-4">
                    <h4 className="text-dark text-sm font-semibold">
                      What price would you like to offer?
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center rounded-md">
                        <Input
                          type="number"
                          prefix="$"
                          suffix="/night"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handlePriceChange(property.id, editValue);
                        setSelectedPropertyToEdit(null);
                      }}
                    >
                      Save
                    </Button>
                    {requestNightlyPriceCents * 1.1 < editNightlyPriceCents && (
                      <div className="text-sm text-red-600">
                        This offer is unlikely to get accepted since it is{" "}
                        {Math.round(
                          ((editNightlyPriceCents - requestNightlyPriceCents) /
                            requestNightlyPriceCents) *
                            100,
                        )}
                        % higher than the requested price.
                      </div>
                    )}
                    {editValue && (
                      <div className="text-sm text-gray-600">
                        By offering this price, your final payout will be{" "}
                        {formatCurrency(
                          baseAmountToHostPayout(
                            editNightlyPriceCents * numNights,
                          ),
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="rounded-md bg-gray-100 p-2">
                      <div className="text-dark text-sm font-semibold">
                        Your offer: ${propertyPrices[property.id]} / night
                      </div>
                      <div className="text-sm">
                        Your total payout: {formatCurrency(hostPayoutCents)}
                      </div>
                      <OfferPriceBreakdown
                        request={request}
                        property={property}
                        hostInputOfferAmount={totalBasePriceBeforeFeesCents}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="justify-between">
          <Button variant="secondary" onClick={() => setStep(0)}>
            Back
          </Button>
          <Button onClick={handleSubmit}>Send Matches</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
