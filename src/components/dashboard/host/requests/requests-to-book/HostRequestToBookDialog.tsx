import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatDateRange,
  getHostPayout,
  getNumNights,
  plural,
} from "@/utils/utils";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { HostDashboardRequestToBook } from "@/components/requests-to-book/TravelerRequestToBookCard";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

export default function HostRequestToBookDialog({
  open,
  setOpen,
  requestToBook,
  currentHostTeamId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestToBook: HostDashboardRequestToBook;
  currentHostTeamId: number;
}) {
  const { data: property, isLoading } = api.properties.getById.useQuery({
    id: requestToBook.propertyId,
  });

  const { mutateAsync: acceptBookingRequest } =
    api.stripe.rejectOrCaptureAndFinalizeRequestToBook.useMutation({
      onSuccess: () => {
        toast({
          variant: "default",
          title: "Booking Accepted",
        });
      },
    });

  const hasCancellationPolicy = Boolean(property?.cancellationPolicy);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <h3 className="text-center text-lg font-bold">Respond</h3>
        </DialogHeader>
        {!isLoading && property ? (
          <>
            <DialogDescription>
              Please review the request details for your property.
            </DialogDescription>
            <div className="space-y-2">
              <div className="rounded-md border p-4">
                <div className="mb-4 flex justify-between">
                  <div className="flex flex-col items-start">
                    <div className="text-dark text-lg font-bold">
                      {formatCurrency(
                        requestToBook.baseAmountBeforeFees /
                          getNumNights(
                            requestToBook.checkIn,
                            requestToBook.checkOut,
                          ),
                      )}
                      /night
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(requestToBook.baseAmountBeforeFees)} total
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
                        getNumNights(
                          requestToBook.checkIn,
                          requestToBook.checkOut,
                        ),
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
                <h4 className="text-dark text-lg font-bold">
                  Requested property
                </h4>
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
                  {hasCancellationPolicy && (
                    <div className="text-sm text-gray-600">
                      By accepting this price, you will be paid{" "}
                      <span className="font-semibold text-black">
                        {formatCurrency(
                          getHostPayout(requestToBook.baseAmountBeforeFees),
                        )}{" "}
                      </span>
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
              <Button
                onClick={() =>
                  acceptBookingRequest({
                    isAccepted: true,
                    requestToBookId: requestToBook.id,
                    currentHostTeamId,
                  })
                    .then(() => {
                      toast({
                        title: "Successfully Booked Trip!",
                      });
                    })
                    .catch((error) => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                      if (error.data?.code === "FORBIDDEN") {
                        toast({
                          title:
                            "You do not have permission to respond to a booking.",
                          description:
                            "Please contact your team owner to request access.",
                        });
                      } else {
                        errorToast();
                      }
                    })
                }
              >
                Confirm
              </Button>
            </DialogFooter>
          </>
        ) : (
          <Spinner />
        )}
      </DialogContent>
    </Dialog>
  );
}
