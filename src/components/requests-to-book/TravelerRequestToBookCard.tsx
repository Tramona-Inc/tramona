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
} from "lucide-react";
import { Card, CardFooter } from "../ui/card";
import RequestToBookCardBadge from "./RequestToBookCardBadge";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestToBookDialog from "./WithdrawRequestToBookDialog";

import { RequestToBookCardPreviews } from "./RequestToBookCardPreviews";

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
    // request.maxTotalPrice
    requestToBook.amountAfterTravelerMarkupAndBeforeFees /
    getNumNights(requestToBook.checkIn, requestToBook.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(
    requestToBook.checkIn,
    requestToBook.checkOut,
  );
  const fmtdNumGuests = plural(requestToBook.numGuests, "guest");

  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      {/* {request.id} */}
      <WithdrawRequestToBookDialog
        requestToBookId={requestToBook.id}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex p-2">
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
                <DropdownMenuContent align="end">
                  <DropdownMenuItem red onClick={() => setOpen(true)}>
                    <TrashIcon />
                    Withdraw
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
              <p>
                Requested <span className="font-semibold">{fmtdPrice}</span>
                /night
              </p>
              <p className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {fmtdDateRange}
                </span>
                &middot;
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
