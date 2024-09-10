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

export default function HostConfirmRequestDialog({
  open,
  setOpen,
  request,
  properties,
  setPropertyPrices,
  propertyPrices,
  setStep,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: HostDashboardRequest;
  properties: Property[];
  setPropertyPrices: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  propertyPrices: Record<number, string>;
  setStep: (step: number) => void;
}) {
  const { toast } = useToast();
  const [selectedPropertyToEdit, setSelectedPropertyToEdit] = useState<
    number | null
  >(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const selectedProperties = properties.filter((property) =>
    propertyPrices.hasOwnProperty(property.id),
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    await Promise.all(
      // todo: make procedure accept array
      selectedProperties.map(async (property) => {
        await createOffersMutation
          .mutateAsync({
            requestId: request.id,
            propertyId: property.id,
            totalPrice: parseInt(propertyPrices[property.id] ?? "0") * 100,
            hostPayout:
              parseFloat(
                getHostPayout({
                  propertyPrice: parseFloat(propertyPrices[property.id] ?? "0"),
                  hostMarkup: HOST_MARKUP,
                  numNights,
                }),
              ) * 100,
            travelerOfferedPrice:
              parseFloat(
                getTravelerOfferedPrice({
                  propertyPrice: parseFloat(propertyPrices[property.id] ?? "0"),
                  travelerMarkup: TRAVELER__MARKUP,
                  numNights,
                }),
              ) * 100,
          })
          .then(() => setStep(2))
          .catch((error) => {
            console.log("Error", error);
            if (error instanceof Error) {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }
          });
      }),
    )
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setStep(1);
      });
  };

  const numNights = getNumNights(request.checkIn, request.checkOut);
  console.log("selectedProperties2", selectedProperties);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogContent className="max-w-lg p-6">
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
                {formatCurrency(request.maxTotalPrice / numNights)}
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
          {selectedProperties.map((property) => (
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
                        type="text"
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
                  {(request.maxTotalPrice / numNights / 100) * 1.1 <
                    parseInt(editValue) && (
                    <div className="text-sm text-red-600">
                      This offer is unlikely to get accepted since it is{" "}
                      {Math.round(
                        ((parseInt(editValue) -
                          request.maxTotalPrice / numNights / 100) /
                          (request.maxTotalPrice / numNights / 100)) *
                          100,
                      )}
                      % higher than the requested price.
                    </div>
                  )}
                  {editValue && (
                    <div className="text-sm text-gray-600">
                      By offering this price, you will be paid $
                      {parseInt(editValue) * numNights} all-in
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="rounded-md bg-gray-100 p-2">
                    <div className="text-dark text-sm font-semibold">
                      Your offer: ${propertyPrices[property.id]} / night
                    </div>
                    <div className="text-sm text-gray-600">
                      Total payout: $
                      {getHostPayout({
                        propertyPrice: parseFloat(
                          propertyPrices[property.id] ?? "0",
                        ),
                        hostMarkup: HOST_MARKUP,
                        numNights: getNumNights(
                          request.checkIn,
                          request.checkOut,
                        ),
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="justify-between">
          <Button variant="secondary" onClick={() => setStep(0)}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            Send Matches
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
