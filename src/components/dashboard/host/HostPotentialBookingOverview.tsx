import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BriefcaseIcon, MapPinIcon } from "lucide-react";
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

export default function HostPotentialBookingOverview({
  className,
}: {
  className?: string;
}) {
  const { data: requestsWithProperties } =
    api.properties.getHostPropertiesWithRequests.useQuery();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Potential Bookings</CardTitle>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/host/requests">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <BubbleTabs defaultValue="city">
        <BubbleTabsList>
          <BubbleTabsTrigger value="city">City</BubbleTabsTrigger>
          <BubbleTabsTrigger value="property">Property</BubbleTabsTrigger>
        </BubbleTabsList>
        <BubbleTabsContent value="city">
          <div className="flex max-h-[400px] flex-row gap-x-5 overflow-y-auto">
            {requestsWithProperties?.map((request, id) => (
              <CardContent key={id}>
                <div className="flex items-start gap-2 rounded-lg border p-4">
                  <MapPinIcon className="text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="text-xl font-semibold">{request.city}</p>
                    </div>
                    <div className="flex gap-1">
                      <Badge variant="secondary" size="sm">
                        {request.requests.length} requests
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            ))}
          </div>
        </BubbleTabsContent>
        <BubbleTabsContent value="property"></BubbleTabsContent>
      </BubbleTabs>
    </Card>
  );
}
