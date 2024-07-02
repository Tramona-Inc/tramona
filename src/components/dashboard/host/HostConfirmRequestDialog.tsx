import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type DetailedRequest } from "@/components/requests/RequestCard";
import { type Property } from "@/server/db/schema/tables/properties";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import Image from "next/image";
import { EllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";

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
  request: DetailedRequest;
  properties: Property[];
  setPropertyPrices: (prices: Record<number, string>) => void;
  propertyPrices: Record<number, string>;
  setStep: (step: number) => void;
}) {
  const handleEdit = (id: number) => {
    // Custom logic to edit the property

  };

  const createOffersMutation = api.offers.create.useMutation();


  const handleRemove = (id: number) => {

    setPropertyPrices((prev: Record<number, string>) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const selectedProperties = properties.filter((property) =>
    propertyPrices.hasOwnProperty(property.id),
  );

  const handleSubmit = async () => {
    // setPropertyPrices(propertyPriceState);
    for (const property of selectedProperties) {
      await createOffersMutation.mutateAsync({
        requestId: request.id,
        propertyId: property.id,
        totalPrice: parseInt(propertyPrices[property.id] ?? "0") * 100,
      });
    }

    setStep(2);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-3xl space-y-4 p-6">
        <DialogHeader>
          <h3 className="text-lg font-bold text-center">Respond</h3>
        </DialogHeader>

        <div className="rounded-md border bg-gray-50 p-4">
          <div className="mb-4 flex justify-between">
            <div className="flex flex-col items-start">
              <div className="text-dark text-lg font-bold">
                {formatCurrency(
                  request.maxTotalPrice /
                    getNumNights(request.checkIn, request.checkOut),
                )}
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
                {plural(
                  getNumNights(request.checkIn, request.checkOut),
                  "night",
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-dark text-lg font-bold">
                {plural(request.numGuests, "guest")}
              </div>
              {/* <div className="text-sm text-gray-600">2 Adults, 2 kids</div> */}
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
          {selectedProperties?.map((property) => (
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
              <div className="flex flex-col space-y-2">
                <div className="rounded-md bg-gray-100 p-2">
                  <div className="text-dark text-sm font-semibold">
                    Your offer: ${propertyPrices[property.id]} / night
                  </div>
                  <div className="text-sm text-gray-600">
                    Total payout: $
                    {parseInt(propertyPrices[property.id] ?? "0") *
                      getNumNights(request.checkIn, request.checkOut)}
                  </div>
                </div>
              </div>
            </div>
          ))}
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
