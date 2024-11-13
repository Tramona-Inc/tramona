import { type Dispatch, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { HostDashboardRequestToBook } from "@/components/requests-to-book/RequestToBookCard";

export default function HostRequestToBookDialog({
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
  // const allPropertyIds = properties
  //   .filter((property) => property.cancellationPolicy)
  //   .map((property) => property.id);

  // const [selectedProperties, setSelectedProperties] =
  //   useState<number[]>(allPropertyIds);

  // const togglePropertySelection = (id: number) => {
  //   setSelectedProperties((prev) => {
  //     const newSelection = prev.includes(id)
  //       ? prev.filter((propertyId) => propertyId !== id)
  //       : [...prev, id];

  //     // Set default price for newly selected properties
  //     if (!prev.includes(id) && !propertyPrices[id]) {
  //       setPropertyPrices((prevPrices) => ({
  //         ...prevPrices,
  //         [id]: fmtdNightlyPrice,
  //       }));
  //     }

  //     return newSelection;
  //   });
  // };

  // const selectAllProperties = () => {
  //   const allPropertyIds = properties
  //     .filter((property) => property.cancellationPolicy)
  //     .map((property) => property.id);

  //   if (selectedProperties.length === allPropertyIds.length) {
  //     setSelectedProperties([]);
  //   } else {
  //     setSelectedProperties(allPropertyIds);
  //   }
  // };

  const fmtdNightlyPrice = // requestToBook.maxTotalPrice /
  (
    12345 /
    getNumNights(requestToBook.checkIn, requestToBook.checkOut) /
    100
  ).toFixed(2);

  const hasCancellationPolicy = Boolean(property.cancellationPolicy);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <h3 className="text-center text-lg font-bold">Respond</h3>
        </DialogHeader>
        <DialogDescription>
          Please review the request details for your property.
        </DialogDescription>
        <div className="space-y-2">
          <div className="rounded-md border p-4">
            <div className="mb-4 flex justify-between">
              <div className="flex flex-col items-start">
                <div className="text-dark text-lg font-bold">
                  {/* {formatCurrency(
                    request.maxTotalPrice /
                      getNumNights(request.checkIn, request.checkOut),
                  )} */}
                  100 /night
                </div>
                <div className="text-sm text-gray-600">
                  {/* {formatCurrency(request.maxTotalPrice)}  */}
                  300 total
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-dark text-lg font-bold">
                  {formatDateRange(
                    requestToBook.checkIn,
                    requestToBook.checkOut,
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {plural(
                    getNumNights(requestToBook.checkIn, requestToBook.checkOut),
                    "night",
                  )}
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
        </div>
        <div className="mt-4">
          <div className="mb-2 flex justify-start">
            <h4 className="text-dark text-lg font-bold">Requested property</h4>
          </div>
          <div className="mb-6 space-y-4">
            <div
              key={property.id}
              className={
                "relative flex flex-col rounded-md border border-primary bg-white p-4"
              }
            >
              <div className="mb-4 flex items-center gap-4">
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

              {!hasCancellationPolicy && (
                <>
                  <AlertCircle
                    className="absolute right-2 top-2 text-red-600"
                    size={16}
                  />
                  <div className="mt-2 text-sm text-red-600">
                    This property does not have a cancellation policy assigned
                    to it. Please{" "}
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
              {hasCancellationPolicy && (
                <div className="text-sm text-gray-600">
                  By accepting this price, you will be paid $
                  {getHostPayout({
                    propertyPrice: parseFloat(fmtdNightlyPrice),
                    hostMarkup: HOST_MARKUP,
                    numNights: getNumNights(
                      requestToBook.checkIn,
                      requestToBook.checkOut,
                    ),
                  })}{" "}
                  all-in
                </div>
              )}
            </div>
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
