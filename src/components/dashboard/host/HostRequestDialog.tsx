/* OfferDialog.tsx */
import { Dispatch, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
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
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function HostRequestDialog({
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
  setPropertyPrices: Dispatch<React.SetStateAction<Record<number, string>>>;
  propertyPrices: Record<number, string>;
  setStep: (step: number) => void;
}) {
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);

  const togglePropertySelection = (id: number) => {
    setSelectedProperties((prev) =>
      prev.includes(id)
        ? prev.filter((propertyId) => propertyId !== id)
        : [...prev, id],
    );
  };

  const handlePriceChange = (id: number, price: string) => {
    setPropertyPrices((prev) => ({ ...prev, [id]: price }));
  };

  const selectAllProperties = () => {
    const allPropertyIds = properties.map((property) => property.id);
    setSelectedProperties(allPropertyIds);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <h3 className="text-center text-lg font-bold">Respond</h3>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm">
            Select the property you&apos;d like to offer.
          </div>
          <div className="space-y-2">
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
                </div>
              </div>
              {request.note && (
                <div className="rounded-md bg-gray-100 p-2">
                  <div className="text-sm text-gray-700">{request.note}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-between">
            <h4 className="text-dark text-lg font-bold">
              Available properties
            </h4>
            <button className="text-primary" onClick={selectAllProperties}>
              Select all
            </button>
          </div>
          <div className="mb-6 space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`flex flex-col rounded-md border bg-white p-4 ${selectedProperties.includes(property.id) ? "border-primary" : "border-gray-200"}`}
              >
                <div className="mb-4 flex items-center gap-4">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={() => togglePropertySelection(property.id)}
                    className="h-4 w-4"
                  />
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

                {selectedProperties.includes(property.id) && (
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
                          value={propertyPrices[property.id]}
                          onChange={(e) =>
                            handlePriceChange(property.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                    {(request.maxTotalPrice /
                      getNumNights(request.checkIn, request.checkOut) /
                      100) *
                      1.1 <
                      parseInt(propertyPrices[property.id] ?? "0") && (
                      <div className="text-sm text-red-600">
                        This offer is unlikely to get accepted since it is{" "}
                        {Math.round(
                          ((parseInt(propertyPrices[property.id] ?? "0") -
                            request.maxTotalPrice /
                              getNumNights(request.checkIn, request.checkOut) /
                              100) /
                            (request.maxTotalPrice /
                              getNumNights(request.checkIn, request.checkOut) /
                              100)) *
                            100,
                        )}
                        % higher than the requested price.
                      </div>
                    )}
                    {propertyPrices[property.id] && (
                      <div className="text-sm text-gray-600">
                        By offering this price, you will be paid $
                        {parseInt(propertyPrices[property.id] ?? "0") *
                          getNumNights(request.checkIn, request.checkOut)}{" "}
                        all-in
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setStep(1)}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
