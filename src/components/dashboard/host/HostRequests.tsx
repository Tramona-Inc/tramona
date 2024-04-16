import Spinner from "@/components/_common/Spinner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";
import { plural } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

export default function HostRequests() {
  const { data: properties } = api.properties.getHostProperties.useQuery();

  return (
    <div className="flex min-h-screen-minus-header">
      <ScrollArea className="sticky inset-y-0 w-80 px-2 py-8">
        <h1 className="text-4xl font-bold">Offers & Requests</h1>
        <div className="pt-4">
          {properties ? (
            properties.map((property) => (
              <Link
                key={property.id}
                href={`/host/requests/${property.id}`}
                className="flex gap-2 rounded-lg p-2 hover:bg-muted"
              >
                <div className="relative h-16 w-16">
                  <Image
                    src={property.imageUrls[0]!}
                    className="rounded-md object-fill object-center"
                    alt=""
                    layout="fill"
                  />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 font-medium">{property.name}</p>
                  <p className="line-clamp-1 text-muted-foreground">
                    {property.address}
                  </p>
                  <Badge size="sm">5 offers</Badge>
                </div>
              </Link>
            ))
          ) : (
            <Spinner />
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
