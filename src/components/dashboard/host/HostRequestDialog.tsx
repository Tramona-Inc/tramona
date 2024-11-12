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
import { DialogTitle } from "@radix-ui/react-dialog";
import { HOST_MARKUP } from "@/utils/constants";
import UserAvatar from "@/components/_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";

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
      <DialogContent className="bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Make an offer to {request.traveler.name}
          </DialogTitle>
        </DialogHeader>

        {/* Guest Request Card */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <UserAvatar
              size="md"
              name={request.traveler.name}
              image={request.traveler.image}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{request.traveler.name}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Verified</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {formatDistanceToNowStrict(request.createdAt, {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-lg font-medium">
              Requested{" "}
              {formatCurrency(
                request.maxTotalPrice /
                  getNumNights(request.checkIn, request.checkOut),
              )}
              /night
            </div>
            <div className="text-muted-foreground">
              {formatDateRange(request.checkIn, request.checkOut)} ·{" "}
              {request.numGuests} guests
            </div>
          </div>
        </div>

        <div className="mt-6 text-muted-foreground">
          Please select the properties you would like to offer and set the
          price.
        </div>

        {/* Properties Section */}
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">Available properties</h4>
              <span className="text-muted-foreground">
                ({selectedProperties.length} selected)
              </span>
            </div>
            <div className="flex gap-4">
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setSelectedProperties([])}
              >
                Reset
              </button>
              <button
                className="text-sm text-primary hover:text-primary/80"
                onClick={selectAllProperties}
              >
                Select all
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`overflow-hidden rounded-lg border ${
                  selectedProperties.includes(property.id)
                    ? "border-primary bg-white"
                    : "border-gray-200 bg-[#fafafa]"
                }`}
              >
                {/* Top section with property info and price */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={() =>
                        togglePropertySelection(property.id)
                      }
                      className="h-5 w-5 rounded-full"
                    />

                    <Image
                      src={property.imageUrls[0]}
                      alt={property.name}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <div
                      className={
                        selectedProperties.includes(property.id)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      <h5 className="text-lg font-medium">{property.name}</h5>
                      <p>{property.city}</p>
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

        <DialogFooter className="mt-6">
          <Button
            onClick={() => setStep(1)}
            className="w-full bg-primaryGreen hover:bg-green-100"
            disabled={selectedProperties.length === 0}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
