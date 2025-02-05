import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import {
  CalendarIcon,
  EllipsisIcon,
  Home,
  MapPinIcon,
  TrashIcon,
  Users2Icon,
  ListCollapseIcon,
} from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import RequestToBookCardBadge from "./RequestToBookCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestToBookDialog from "./WithdrawRequestToBookDialog";

import { RequestToBookCardPreviews } from "./RequestToBookCardPreviews";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { breakdownPaymentByPropertyAndTripParams } from "@/utils/payment-utils/paymentBreakdown";
import ViewBidDetailsContent from "./ViewBidDetailsContent";

export type HostDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getHostRequestsToBookFromId"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

export type GuestDashboardRequestToBook =
  RouterOutputs["requestsToBook"]["getMyRequestsToBook"][
    | "activeRequestsToBook"
    | "inactiveRequestsToBook"][number];

export default function TravelerRequestToBookCard({
  requestToBook,
  // property,
  type,
  children,
}: (
  | {
      type: "guest";
      requestToBook: GuestDashboardRequestToBook;
    }
  // change these
  | {
      type: "admin";
      requestToBook: GuestDashboardRequestToBook;
    }
) & {
  children?: React.ReactNode;
}) {
  const pricePerNight =
    requestToBook.calculatedTravelerPrice /
    getNumNights(requestToBook.checkIn, requestToBook.checkOut);

  const fmtdPrice = formatCurrency(pricePerNight); //price before fees but after markup
  const fmtdDateRange = formatDateRange(
    requestToBook.checkIn,
    requestToBook.checkOut,
  );
  const fmtdNumGuests = plural(requestToBook.numGuests, "guest");

  const [open, setOpen] = useState(false);
  const [openMoreDetails, setOpenMoreDetails] = useState(false);

  const paymentBreakdown = breakdownPaymentByPropertyAndTripParams({
    dates: {
      checkIn: requestToBook.checkIn,
      checkOut: requestToBook.checkOut,
    },
    calculatedTravelerPrice: requestToBook.calculatedTravelerPrice,
    property: requestToBook.property,
  });

  const serviceFee =
    paymentBreakdown.superhogFee + paymentBreakdown.stripeTransactionFee;

  const totalbeforeFees =
    paymentBreakdown.totalTripAmount! - serviceFee - paymentBreakdown.taxesPaid;

  const numOfNights = getNumNights(
    requestToBook.checkIn,
    requestToBook.checkOut,
  );

  return (
    <Card className="overflow-hidden p-0">
      <WithdrawRequestToBookDialog
        requestToBookId={requestToBook.id}
        open={open}
        onOpenChange={setOpen}
      />
      <ViewBidDetailsContent
        requestToBook={requestToBook}
        openMoreDetails={openMoreDetails}
        onOpenChangeMoreDetails={setOpenMoreDetails}
      />
      <div className="flex flex-col gap-4 p-2 md:flex-row">
        <div className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
          <div className="flex items-center gap-2">
            <RequestToBookCardBadge requestToBook={requestToBook} />
            <div className="flex-1" />
            {type === "guest" && !requestToBook.resolvedAt && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="">
                  <DropdownMenuItem
                    onClick={() => setOpenMoreDetails(true)}
                    className="flex flex-row justify-between"
                  >
                    View details
                    <ListCollapseIcon className="size-4" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    red
                    onClick={() => setOpen(true)}
                    className="mx-auto flex flex-row justify-between"
                  >
                    Withdraw
                    <TrashIcon className="size-4" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="space-y-1">
            <div>
              <div className="flex items-start gap-1">
                <MapPinIcon className="shrink-0 text-primary" />
                <h2 className="text-base font-bold text-primary md:text-lg">
                  {requestToBook.property.city}
                </h2>
              </div>
              <div className="flex items-start gap-1">
                <Home className="shrink-0 text-primary" />
                <h2 className="text-base font-bold text-primary md:text-lg">
                  {requestToBook.property.name}
                </h2>
              </div>
            </div>
            <div>
              <p className="text-sm sm:text-base">
                Requested <span className="font-semibold">{fmtdPrice}</span>
                /night
              </p>
              <Dialog>
                <DialogTrigger className="text-sm underline">
                  See more
                </DialogTrigger>
                <DialogContent className="w-full max-w-md sm:max-w-lg">
                  <div className="flex flex-col gap-y-4 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between border-b pb-2">
                      <p className="font-semibold">Trip Breakdown</p>
                    </div>
                    <div className="flex flex-col justify-between sm:flex-row">
                      <span>$128.12 x {numOfNights} nights</span>
                      <span className="text-right">
                        {formatCurrency(totalbeforeFees)}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between sm:flex-row">
                      <span>Cleaning fee</span>
                      <span className="text-right font-semibold">Included</span>
                    </div>
                    <div className="flex flex-col justify-between sm:flex-row">
                      <span>Tramona service fee</span>
                      <span className="text-right">
                        {formatCurrency(serviceFee)}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between sm:flex-row">
                      <span>Taxes</span>
                      <span className="text-right">
                        {formatCurrency(paymentBreakdown.taxesPaid)}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between border-t pt-2 text-lg font-semibold sm:flex-row">
                      <span>Total (USD)</span>
                      <span className="text-right">
                        {formatCurrency(paymentBreakdown.totalTripAmount!)}
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <p className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {fmtdDateRange}
                </span>
                <span className="hidden sm:block">&middot;</span>
                <span className="flex items-center gap-1">
                  <Users2Icon className="h-4 w-4" />
                  {fmtdNumGuests}
                </span>
              </p>
            </div>
          </div>
          <CardFooter className="empty:hidden">{children}</CardFooter>
        </div>
        {type === "guest" && requestToBook.status !== "Accepted" && (
          <RequestToBookCardPreviews requestToBook={requestToBook} />
        )}
      </div>
    </Card>
  );
}
