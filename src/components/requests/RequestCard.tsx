import { type RouterOutputs } from "@/utils/api";
import { getFmtdFilters, getRequestStatus } from "@/utils/formatters";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { EllipsisIcon, MapPinIcon, Pencil, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import RequestCardBadge from "./RequestCardBadge";
import RequestGroupAvatars from "./RequestGroupAvatars";
import WithdrawRequestDialog from "./WithdrawRequestDialog";

import { Separator } from "../ui/separator";
import EditRequestDialog from "./EditRequestDialog";
import MobileSimilarProperties from "./MobileSimilarProperties";

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
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <Card className="block">
      <WithdrawRequestDialog
        requestId={request.id}
        open={open}
        onOpenChange={setOpen}
      />
      <EditRequestDialog
        request={request}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
      <CardContent className="space-y-2">
        {/* <p className="font-mono text-xs uppercase text-muted-foreground">
          Id: {request.id} · Request group Id: {request.requestGroupId}
        </p> */}
        <RequestCardBadge request={request} />
        {/* {request.requestGroup.hasApproved ? (
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
        )} */}
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
                <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                  <Pencil />
                  Edit
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
        <div>
          <p>Requested {fmtdPrice}/night</p>
          <p>{fmtdDateRange}</p>
          {fmtdFilters && <p>{fmtdFilters} &middot;</p>}
          <p>{fmtdNumGuests}</p>
          {request.note && <p>&ldquo;{request.note}&rdquo;</p>}
        </div>
        <div className="flex justify-end gap-2">{children}</div>
        {isSelected && (
          <div className="md:hidden">
            <Separator className="my-1" />
            <MobileSimilarProperties
              location={request.location}
              city={request.location}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
