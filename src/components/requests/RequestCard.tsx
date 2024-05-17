import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import { getFmtdFilters, getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import {
  CalendarIcon,
  EllipsisIcon,
  FilterIcon,
  MapPinIcon,
  TrashIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";
import RequestGroupAvatars from "./RequestGroupAvatars";
import RequestCardBadge from "./RequestCardBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useState } from "react";
import WithdrawRequestDialog from "./WithdrawRequestDialog";
import { useMediaQuery } from "../_utils/useMediaQuery";
import MobileSimiliarProperties from "./MobileSimilarProperties";
import TestMobileSimilarProperties from "./TestMobileSimilarProperties";
import { Separator } from "../ui/separator";

export type DetailedRequest = RouterOutputs["requests"]["getMyRequests"][
  | "activeRequestGroups"
  | "inactiveRequestGroups"][number]["requests"][number];

export type RequestWithUser = RouterOutputs["requests"]["getAll"][
  | "incomingRequests"
  | "pastRequests"][number];

export default function RequestCard({
  request,
  isSelected,
  isAdminDashboard,
  children,
}: React.PropsWithChildren<
  | {
      request: DetailedRequest;
      isAdminDashboard?: false | undefined;
      isSelected?: boolean;
    }
  | {
      request: RequestWithUser;
      isAdminDashboard: true;
      isSelected?: boolean;
    }
>) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const pricePerNight =
    request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
  const fmtdPrice = formatCurrency(pricePerNight);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  const fmtdFilters = getFmtdFilters(request, {
    withoutNote: true,
    excludeDefaults: true,
  });

  const showAvatars = request.numGuests > 1 || isAdminDashboard;

  const [open, setOpen] = useState(false);

  return (
    <Card key={request.id}>
      <WithdrawRequestDialog
        requestId={request.id}
        open={open}
        onOpenChange={setOpen}
      />
      <CardContent className="space-y-2">
        {/* <p className="font-mono text-xs uppercase text-muted-foreground">
          Id: {request.id} · Request group Id: {request.requestGroupId}
        </p> */}
        {request.requestGroup.hasApproved ? (
          <RequestCardBadge request={request} />
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="lightGray" className="border tracking-tight">
                Unconfirmed
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-64">
              You haven&apos;t confirmed your request yet. Check your text
              messages or click &quot;Resend Confirmation&quot; to start getting
              offers.
            </TooltipContent>
          </Tooltip>
        )}
        <div className="absolute right-2 top-0 flex items-center gap-2">
          {showAvatars && (
            <RequestGroupAvatars
              request={request}
              isAdminDashboard={isAdminDashboard}
            />
          )}
          {!isAdminDashboard && getRequestStatus(request) === "pending" && (
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
        <div className="flex items-start gap-1">
          <MapPinIcon className="shrink-0 text-primary" />
          <h2 className="text-base font-bold text-primary md:text-lg">
            {request.location}
          </h2>
        </div>
        <div className="space-y-1 text-sm text-primary  md:space-y-0 md:text-base">
          <p className="text-sm font-semibold text-primary md:text-base ">
            Requested <span className=" text-foreground">{fmtdPrice}</span>
            <span className="text-sm">/night</span>
          </p>
          <div className="flex items-center gap-1">
            <p className="mr-3 font-semibold">{fmtdDateRange}</p>
          </div>
          {fmtdFilters && (
            <div className="flex items-center gap-1 font-light">
              <p>{fmtdFilters}</p>
            </div>
          )}
        </div>
        {request.note && (
          <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
            <p>&ldquo;{request.note}&rdquo;</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="">
        <div className="-mt-3 flex w-full flex-col justify-between gap-y-2 md:mt-0  md:flex-row md:gap-y-0">
          <div className="flex flex-row items-center space-x-1 font-semibold">
            <p>{fmtdNumGuests}</p>
          </div>
          {children}
          {isMobile && isSelected && (
            <div className="flex flex-col gap-y-2 ">
              <Separator className="mt-3" />
              <TestMobileSimilarProperties
                location={request.location}
                city={request.location}
              />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
