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
import { api, type RouterOutputs } from "@/utils/api";
import { cn, plural } from "@/utils/utils";
import { range } from "lodash";
import { HandshakeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HostRequestsSidebarProperty =
  RouterOutputs["properties"]["getHostRequestsSidebar"][number];

export default function HostRequestsLayout({
  children,
}: React.PropsWithChildren) {
  const { data: properties } = api.properties.getHostRequestsSidebar.useQuery();

  const citiesTotal = 0;
  const propertiesTotal = 0;

  return (
    <div className="flex">
      <ScrollArea className="sticky inset-y-0 h-screen-minus-header w-96 border-r px-4 py-8">
        <h1 className="text-2xl font-bold">Offers & Requests</h1>
        <div className="flex flex-row gap-2">
          <Button variant={"secondaryLight"} className="rounded-full">
            Cities {citiesTotal}
          </Button>
          <Button variant={"greenPrimaryOutline"} className="rounded-full">
            Properties {propertiesTotal}
          </Button>
        </div>
        <div className="pt-4">
          {properties ? (
            properties.length > 0 ? (
              properties.map((property) => (
                <SidebarProperty key={property.id} property={property} />
              ))
            ) : (
              <EmptyState
                icon={HandshakeIcon}
                className="h-[calc(100vh-280px)]"
              >
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
              Select a property to view its requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarProperty({
  property,
}: {
  property: HostRequestsSidebarProperty;
}) {
  const href = `/host/requests/${property.id}`;
  const pathname = usePathname();
  const isSelected = pathname.startsWith(href);

  return (
    <Link
      key={property.id}
      href={href}
      className={cn(
        "flex gap-2 rounded-lg p-2",
        isSelected ? "bg-accent/60" : "hover:bg-muted",
      )}
    >
      <div className="relative h-16 w-16 overflow-clip rounded-md bg-accent">
        <Image
          src={property.imageUrls[0]!}
          className="object-cover object-center"
          alt=""
          fill
        />
      </div>
      <div className="flex-1 text-sm">
        <p className="line-clamp-1 font-medium">{property.name}</p>
        <p className="line-clamp-1 text-muted-foreground">{property.address}</p>
        <Badge size="sm">{plural(property.numRequests, "request")}</Badge>
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
