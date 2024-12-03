import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { api } from "@/utils/api";
import {
  BubbleTabs,
  BubbleTabsTrigger,
  BubbleTabsContent,
  BubbleTabsList,
} from "@/components/ui/bubble-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatDateRange } from "@/utils/utils";
import { formatDistance } from "date-fns";
import { enUS } from "date-fns/locale";
import type {
  FormatDistanceOptions,
  FormatDistanceToken,
  Locale,
} from "date-fns";
import { CheckCircle } from "lucide-react";

const createCustomLocale = (baseLocale: Locale): Locale => ({
  ...baseLocale,
  formatDistance: (
    token: FormatDistanceToken,
    count: number,
    options?: FormatDistanceOptions,
  ) => {
    let result = baseLocale.formatDistance(token, count, options);
    if (result.startsWith("about ")) {
      result = result.replace("about ", "");
    }
    return result;
  },
});

const userLocale = typeof window !== "undefined" ? navigator.language : "en-US";
const locale = userLocale === "en-US" ? createCustomLocale(enUS) : enUS; // Adjust as needed for additional locales

// Usage example

export default function HostPotentialBookingOverview({
  className,
}: {
  className?: string;
}) {
  const { data: requestsWithProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-x-2 pb-2">
        <h2 className="text-4xl font-semibold">Potential Bookings</h2>
        <div className="flex-1" />
        <Button variant="ghost" asChild>
          <Link href="/host/requests">
            See all
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <BubbleTabs defaultValue="city">
        <BubbleTabsList>
          <BubbleTabsTrigger value="city">City</BubbleTabsTrigger>
          <BubbleTabsTrigger value="property">Property</BubbleTabsTrigger>
        </BubbleTabsList>
        <BubbleTabsContent value="city">
          <div className="flex max-h-[400px] flex-row gap-4 overflow-x-auto pb-4">
            {requestsWithProperties?.flatMap((cityRequest) =>
              cityRequest.requests.map((request, index) => (
                <Card
                  key={`${cityRequest.city}-${index}`}
                  className="w-[300px] flex-shrink-0 border"
                >
                  <CardContent className="">
                    <div className="justify-between space-y-4">
                      {/* User Info */}
                      <p className="text-center font-semibold">
                        {request.request.location}
                      </p>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={request.request.traveler.image!} />
                          <AvatarFallback>
                            {request.request.traveler.firstName}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {request.request.traveler.firstName}
                          </span>
                          <span>•</span>
                          <Badge variant="secondary" className="font-normal">
                            Verified
                          </Badge>
                          <span>•</span>
                          <span className="text-muted-foreground">
                            {formatDistance(
                              request.request.createdAt,
                              new Date(),
                              { addSuffix: true, locale },
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Request Details */}
                      <div className="space-y-2">
                        <p className="text-lg">
                          Requested{" "}
                          {formatCurrency(request.request.maxTotalPrice)}
                          /night
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {formatDateRange(
                              request.request.checkIn,
                              request.request.checkOut,
                            )}
                          </span>
                          <span>•</span>
                          <span>{request.request.numGuests} guests</span>
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
        </BubbleTabsContent>
        <BubbleTabsContent value="property">
          <EmptyBookingState />
        </BubbleTabsContent>
      </BubbleTabs>
    </div>
  );
}

function EmptyBookingState() {
  return (
    <Card className="border-primary/20">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <CheckCircle className="h-6 w-6 text-primary" />
        <p className="text-lg text-muted-foreground">
          You don&apos;t have any potential bookings as of now
        </p>
        <Button variant="link" asChild>
          <Link href="/host/calendar">Edit Restrictions</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
