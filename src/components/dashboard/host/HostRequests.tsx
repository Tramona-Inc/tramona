import Spinner from "@/components/_common/Spinner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function HostRequests({ children }: React.PropsWithChildren) {
  const router = useRouter();
  const propertyId = router.query.id as string;

  // const  {data: requests} = api.requests.get
  const { data: properties } = api.properties.getHostProperties.useQuery();

  return (
    <div className="flex">
      <ScrollArea className="sticky inset-y-0 h-screen-minus-header w-96 px-4 py-8">
        <h1 className="text-2xl font-bold">Offers & Requests</h1>
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
      {children ?? (
        <div className="grid h-screen-minus-header flex-1 place-items-center">
          <p className="font-medium text-muted-foreground">
            Select a property to view its requests
          </p>
        </div>
      )}
    </div>
  );
}
