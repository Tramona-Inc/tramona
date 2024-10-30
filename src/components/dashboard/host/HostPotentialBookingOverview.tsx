import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
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

export default function HostPotentialBookingOverview({
  className,
}: {
  className?: string;
}) {
  const { data: requestsWithProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery();

  return (
    <div>
      <div className="flex items-center gap-x-2 pb-2">
        <h2 className="text-4xl font-bold">Potential Bookings</h2>
        <div className="flex-1" />
        <Button variant="ghost" asChild>
          <Link href="/host/requests">
            See all
            <ArrowRightIcon />
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
                  <CardContent className="pt-6">
                    <div className="justify-between space-y-4">
                      {/* User Info */}
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
                              { addSuffix: true },
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
                        <Button variant="secondary" className="w-full">
                          Reject
                        </Button>
                        <Button className="w-full" variant="primary">
                          Make an offer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )),
            )}
          </div>
        </BubbleTabsContent>
        <BubbleTabsContent value="property"></BubbleTabsContent>
      </BubbleTabs>
    </div>
  );
}
