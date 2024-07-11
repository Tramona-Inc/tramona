import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SkeletonText } from "@/components/ui/skeleton";
import { type Property } from "@/server/db/schema/tables/properties";
import { api } from "@/utils/api";
import { plural } from "@/utils/utils";
import { range } from "lodash";
import { HandshakeIcon } from "lucide-react";
import Link from "next/link";

import { MapPinIcon } from "lucide-react";

interface CityData {
  city: string;
  requests: {
    request: Request;
    properties: Property[];
  }[];
}

export default function HostRequestsLayout({ children }: React.PropsWithChildren) {
  const { data: properties } = api.properties.getHostPropertiesWithRequests.useQuery();
  const citiesTotal = properties ? properties.length : 0;

  return (
    <div className="flex">
      <ScrollArea className="sticky inset-y-0 h-screen-minus-header w-80 border-r px-4 py-8 bg-white">
        <div className="pb-4">
          <h1 className="text-3xl font-bold">Requests</h1>
          <div className="flex flex-row gap-2 mt-4">
            <Button variant={"secondaryLight"} className="rounded-full">
              Cities {citiesTotal}
            </Button>
          </div>
        </div>
        <div className="pt-4">
          {properties ? (
            properties.length > 0 ? (
              properties.map((cityData) => (
                <SidebarCity key={cityData.city} cityData={cityData} />
              ))
            ) : (
              <EmptyState icon={HandshakeIcon} className="h-[calc(100vh-280px)]">
                <EmptyStateTitle>No requests yet</EmptyStateTitle>
                <EmptyStateDescription>
                  Properties with requests will show up here
                </EmptyStateDescription>
                <EmptyStateFooter>
                  <Button asChild variant="outline">
                    <Link href="/host/properties">View all properties</Link>
                  </Button>
                </EmptyStateFooter>
              </EmptyState>
            )
          ) : (
            range(10).map((i) => <SidebarPropertySkeleton key={i} />)
          )}
        </div>
      </ScrollArea>
      <div className="flex-1">
        {children ? (
          <div className="px-4 pb-32 pt-8">
            <div className="mx-auto max-w-5xl">{children}</div>
          </div>
        ) : (
          <div className="grid h-screen-minus-header flex-1 place-items-center">
            <p className="font-medium text-muted-foreground">
              Select a city to view its requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarCity({ cityData }: { cityData: CityData }) {
  const href = `/host/requests/${cityData.city}`;
  return (
    <Link href={href} className="block mb-4">
      <div className="flex gap-2 rounded-lg p-2 hover:bg-muted">
        <MapPinIcon className="h-5 w-5 text-gray-600" />
        <div className="flex-1 text-sm">
          <h3 className="font-semibold">{cityData.city}</h3>
          <Badge size="sm">{plural(cityData.requests.length, "request")}</Badge>
        </div>
      </div>
    </Link>
  );
}

function SidebarPropertySkeleton() {
  return (
    <div className="flex gap-2 p-2">
      <div className="h-16 w-16 rounded-md bg-accent" />
      <div className="flex-1 text-sm">
        <SkeletonText />
        <SkeletonText className="w-2/3" />
        <Badge size="sm" variant="skeleton" className="w-20" />
      </div>
    </div>
  );
}
