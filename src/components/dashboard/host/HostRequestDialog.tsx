import { type Dispatch, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
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
  plural,
} from "@/utils/utils";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";

export default function HostRequestDialog({
  open,
  setOpen,
  request,
  properties,
  setPropertyPrices,
  propertyPrices,
  setStep,
  setSelectedProperties,
  selectedProperties,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: HostDashboardRequest;
  properties: Property[];
  setPropertyPrices: Dispatch<React.SetStateAction<Record<number, string>>>;
  propertyPrices: Record<number, string>;
  setStep: (step: number) => void;
  setSelectedProperties: Dispatch<React.SetStateAction<number[]>>;
  selectedProperties: number[];
}) {
  // const allPropertyIds = properties
  //   .filter((property) => property.cancellationPolicy)
  //   .map((property) => property.id);

  // const [selectedProperties, setSelectedProperties] =
  //   useState<number[]>(allPropertyIds);

  const numNights = getNumNights(request.checkIn, request.checkOut);

  const togglePropertySelection = (id: number) => {
    setSelectedProperties((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((propertyId) => propertyId !== id)
        : [...prev, id];

      // Set default price for newly selected properties
      if (!prev.includes(id) && !propertyPrices[id]) {
        setPropertyPrices((prevPrices) => ({
          ...prevPrices,
          [id]: fmtdNightlyPrice,
        }));
      }

      return newSelection;
    });
  };

  const selectAllProperties = () => {
    const allPropertyIds = properties
      .filter((property) => property.cancellationPolicy)
      .map((property) => property.id);

    if (selectedProperties.length === allPropertyIds.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(allPropertyIds);
    }
  };

  const fmtdNightlyPrice = (request.maxTotalPrice / numNights / 100).toFixed(2);

  // console.log("selectedProperties1", selectedProperties);

  useEffect(() => {
    const initialSelectedProperties = properties
      .filter((property) => property.cancellationPolicy)
      .map((property) => property.id);

    setSelectedProperties(initialSelectedProperties);

    initialSelectedProperties.forEach((id) => {
      if (propertyPrices[id] === undefined) {
        setPropertyPrices((prevPrices) => ({
          ...prevPrices,
          [id]: fmtdNightlyPrice,
        }));
      }
    });
  }, [
    properties,
    fmtdNightlyPrice,
    setSelectedProperties,
    setPropertyPrices,
    propertyPrices,
  ]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <h3 className="text-center text-lg font-bold">Respond</h3>
        </DialogHeader>
        <DialogDescription>
          Please select the properties you would like to offer and set the
          price.
        </DialogDescription>
        <div className="space-y-2">
          <div className="rounded-md border p-4">
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
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-between">
            <h4 className="text-dark text-lg font-bold">
              Available properties
            </h4>
            <button className="text-primary" onClick={selectAllProperties}>
              {selectedProperties.length === properties.length
                ? "Deselect all"
                : "Select all"}
            </button>
          </div>
          <div className="mb-6 space-y-4">
            {properties.map((property) => {
              const hasCancellationPolicy = Boolean(
                property.cancellationPolicy,
              );

              const nightlyPriceCents =
                parseFloat(propertyPrices[property.id] ?? "0") * 100;

              const totalPriceCents = nightlyPriceCents * numNights;
              const hostPayoutCents = getHostPayout(totalPriceCents);

              return (
                <div
                  key={property.id}
                  className={`relative flex flex-col rounded-md border bg-white p-4 ${
                    selectedProperties.includes(property.id)
                      ? "border-primary"
                      : "border-gray-200"
                  } ${!hasCancellationPolicy ? "cursor-not-allowed" : ""}`}
                >
                  <div className="mb-4 flex items-center gap-4">
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={() =>
                        hasCancellationPolicy &&
                        togglePropertySelection(property.id)
                      }
                      className="h-4 w-4"
                      disabled={!hasCancellationPolicy}
                    />

                    <Image
                      src={property.imageUrls[0]!}
                      alt={property.name}
                      width={64}
                      height={64}
                      className="size-16 rounded object-cover"
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

                  {!hasCancellationPolicy && (
                    <>
                      <AlertCircle
                        className="absolute right-2 top-2 text-red-600"
                        size={16}
                      />
                      <div className="mt-2 text-sm text-red-600">
                        This property does not have a cancellation policy
                        assigned to it. Please{" "}
                        <a
                          href={`/host/properties/${property.id}`}
                          className="text-primary underline"
                        >
                          click here
                        </a>{" "}
                        to assign a cancellation policy.
                      </div>
                    </>
                  )}

                  {selectedProperties.includes(property.id) &&
                    hasCancellationPolicy && (
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
                              value={propertyPrices[property.id]}
                              onChange={(e) =>
                                setPropertyPrices((prev) => ({
                                  ...prev,
                                  [property.id]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        {(request.maxTotalPrice / numNights / 100) * 1.1 <
                          parseInt(propertyPrices[property.id] ?? "0") && (
                          <div className="text-sm text-red-600">
                            This offer is unlikely to get accepted since it is{" "}
                            {Math.round(
                              ((parseFloat(propertyPrices[property.id] ?? "0") -
                                request.maxTotalPrice / numNights / 100) /
                                (request.maxTotalPrice / numNights / 100)) *
                                100,
                            )}
                            % higher than the requested price.
                          </div>
                        )}
                        {propertyPrices[property.id] && (
                          <div className="text-sm text-gray-600">
                            By offering this price, you will be paid{" "}
                            {formatCurrency(hostPayoutCents)} all-in
                          </div>
                        )}
                      </div>
                    )}
                </div>
              );
            })}
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
