import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/utils";
import type { RouterOutputs } from "@/utils/api";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type RequestForDetailedSidebar = RouterOutputs["requests"]["getById"];

export type BidForDetailedSidebar =
  RouterOutputs["requestsToBook"]["getByPropertyId"][number];

interface TravelerBidOrRequestSectionProps {
  bid: BidForDetailedSidebar | undefined;
  request: RequestForDetailedSidebar | undefined;
  setWithdrawOpen: (value: boolean) => void;
  isLoading?: boolean;
}

function TravelerBidOrRequestSection({
  bid,
  request,
  setWithdrawOpen,
  isLoading = false,
}: TravelerBidOrRequestSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  if (!bid && !request) {
    return null;
  }

  return (
    <Card>
      <CardTitle className="flex w-full justify-end">
        <Badge>
          {(bid?.status ?? request?.resolvedAt ?? request?.resolvedAt)
            ? "Resolved"
            : "Pending"}
        </Badge>{" "}
      </CardTitle>
      <CardContent className="grid gap-6 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Dates Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Dates</span>
            </div>
            <div className="grid gap-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Check-in</span>
                <span>
                  {bid?.checkIn.toLocaleDateString() ??
                    request?.checkIn.toLocaleDateString() ??
                    "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Check-out</span>
                <span>
                  {bid?.checkOut.toLocaleDateString() ??
                    request?.checkOut.toLocaleDateString() ??
                    "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Details</span>
            </div>
            <div className="grid gap-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Guests</span>
                <span>{bid?.numGuests ?? request?.numGuests ?? "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Amount</span>
                <span className="font-medium text-primary">
                  {formatCurrency(
                    bid?.calculatedTravelerPrice ?? request?.maxTotalPrice ?? 0,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {request?.note && <p>Note:{request.note}</p>}
      </CardContent>
      <CardFooter className="flex justify-end border-t p-6">
        <Button
          variant="primary"
          onClick={() => setWithdrawOpen(true)}
          className="w-full text-sm sm:w-auto"
        >
          Make Another Request
        </Button>
        <Button
          variant="outline"
          onClick={() => setWithdrawOpen(true)}
          className="w-full text-sm sm:w-auto"
        >
          Withdraw Request
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TravelerBidOrRequestSection;
