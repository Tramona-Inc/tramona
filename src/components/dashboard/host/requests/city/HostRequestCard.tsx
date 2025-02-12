import { formatDistanceToNowStrict } from "date-fns";
import { type RouterOutputs } from "@/utils/api";
import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { TravelerVerificationsDialog } from "@/components/requests/TravelerVerificationsDialog";
import { Card, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatDateRange, plural } from "@/utils/utils";
import { EllipsisIcon } from "lucide-react";
import { ClockIcon } from "lucide-react";
import { useState } from "react";
import {
  requestAmountToBaseOfferedAmount,
  baseAmountToHostPayout,
} from "@/utils/payment-utils/paymentBreakdown";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useChatWithUserForRequest } from "@/utils/messaging/useChatWithUserForRequest";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";

export type HostDashboardRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"][number]["requests"][number]["request"];

export type HostDashboardPropertyRequest =
  RouterOutputs["properties"]["getHostPropertiesWithRequests"][number]["requests"][number]["properties"][number];

export default function HostRequestCard({
  currentHostTeamId,
  request,
  children,
}: {
  request: HostDashboardRequest;
  currentHostTeamId: number | null | undefined;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const baseAmount = requestAmountToBaseOfferedAmount(request.maxTotalPrice);
  const hostPayoutAmount = baseAmountToHostPayout(baseAmount);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  const chatWithUserForRequest = useChatWithUserForRequest();
  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();

  return (
    <Card className="flex-1 space-y-4 overflow-hidden p-4 pt-2">
      <div className="flex w-full flex-row justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar
            size="sm"
            name={request.traveler.name}
            image={request.traveler.image}
          />
          <TravelerVerificationsDialog request={request} />
          <p>·</p>
          <p className="text-xs">
            {formatDistanceToNowStrict(request.createdAt, {
              addSuffix: true,
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                void chatWithUserForRequest(request.traveler.id, request.id);
              }}
            >
              Message User
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (!currentHostTeamId) {
                  toast({
                    title: "Error",
                    description:
                      "Could not reject request. Host team ID is missing.",
                    variant: "destructive",
                  });
                  return;
                }
                await rejectRequest({
                  requestId: request.id,
                  currentHostTeamId: Number(currentHostTeamId), // Ensure currentHostTeamId is a Number here as well
                })
                  .then(() => {
                    toast({
                      title: "Successfully rejected request",
                    });
                  })
                  .catch((error) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    if (error.data?.code === "FORBIDDEN") {
                      toast({
                        title: "You do not have permission to create an offer.",
                        description:
                          "Please contact your team owner to request access.",
                      });
                    } else {
                      errorToast();
                    }
                  });
              }}
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="">
        <div>
          <p>
            Requested{" "}
            <span className="font-medium">{formatCurrency(baseAmount)}</span>
            /night
          </p>
          <p className="text-xs text-muted-foreground">
            Your payout after fees:{" "}
            <span className="font-normal">
              {formatCurrency(hostPayoutAmount)}
            </span>
          </p>
          <p className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {fmtdDateRange}
            </span>
            ·<span className="flex items-center gap-1">{fmtdNumGuests}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {request.minNumBeds && request.minNumBeds > 1 && (
            <Badge>{request.minNumBeds}+ beds</Badge>
          )}
          {request.minNumBedrooms && request.minNumBedrooms > 1 && (
            <Badge>{request.minNumBedrooms}+ bedrooms</Badge>
          )}
          {request.minNumBathrooms && request.minNumBathrooms > 1 && (
            <Badge>{request.minNumBathrooms}+ bathrooms</Badge>
          )}
          {request.propertyType && <Badge>{request.propertyType}</Badge>}
          {request.amenities.map((amenity) => (
            <Badge key={amenity}>{amenity}</Badge>
          ))}
        </div>

        {request.note && (
          <div className="rounded-lg bg-zinc-100 px-4 py-2">
            <p className="text-xs text-muted-foreground">Note</p>
            <p>{request.note}</p>
          </div>
        )}
      </div>

      {children && <CardFooter>{children}</CardFooter>}
    </Card>
  );
}
