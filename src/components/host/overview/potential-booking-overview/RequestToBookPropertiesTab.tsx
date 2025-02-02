import React from "react";
import { formatCurrency, formatDateRange } from "@/utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EmptyBookingState from "./EmptyBookingState";
import { api } from "@/utils/api";
import UserAvatar from "@/components/_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";

function RequestToBookPropertiesTab({
  currentHostTeamId,
}: {
  currentHostTeamId: number | null | undefined;
}) {
  const { data: properties, isLoading } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      {
        enabled: !!currentHostTeamId,
      },
    );

  if (
    !properties ||
    properties.every((property) => property.requestsToBook.length === 0)
  )
    return <EmptyBookingState type="property" isLoading={isLoading} />;

  return (
    <div className="flex max-h-[400px] flex-row gap-4 overflow-x-auto pb-4">
      {properties.map((property) =>
        property.requestsToBook.map((requestToBook, index) => (
          <Card
            key={`${property.id}-${index}`}
            className="w-[300px] flex-shrink-0 border"
          >
            <CardContent className="">
              <div className="justify-between space-y-4">
                {/* User Info */}
                <p className="text-center font-semibold">{property.name}</p>
                <div className="flex items-center gap-2">
                  <UserAvatar {...requestToBook.madeByGroup.owner} />
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">
                      {requestToBook.madeByGroup.owner.firstName}
                    </span>
                    <span>•</span>
                    <Badge variant="secondary" className="font-normal">
                      Verified
                    </Badge>
                    <span>•</span>
                    <span className="text-muted-foreground">
                      {formatDistanceToNowStrict(property.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                {/* Request Details */}
                <div className="space-y-2">
                  <p className="text-lg">
                    Requested{" "}
                    {formatCurrency(requestToBook.calculatedTravelerPrice)}
                    /night
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {formatDateRange(
                        requestToBook.checkIn,
                        requestToBook.checkOut,
                      )}
                    </span>
                    <span>•</span>
                    <span>{requestToBook.numGuests} guests</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href="/host/requests">
                    <Button variant="secondary" className="w-full">
                      Reject
                    </Button>
                  </Link>
                  <Link href="/host/requests">
                    <Button className="w-full" variant="primary">
                      Make an offer
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )),
      )}
    </div>
  );
}

export default RequestToBookPropertiesTab;
