import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { plural } from "@/utils/utils";
import HostCityRequestCard from "./HostCityRequestCard";

export default function HostRequests() {
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: requests } = api.requests.getByPropertyId.useQuery(propertyId);
  const { data: properties } = api.properties.getHostRequestsSidebar.useQuery();
  const property = properties?.find((p) => p.id === propertyId);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative h-20 w-32 overflow-clip rounded-md bg-accent">
          {property && (
            <Image
              src={property.imageUrls[0]!}
              className="object-cover object-center"
              alt=""
              layout="fill"
            />
          )}
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold">
            {property?.name ?? <SkeletonText className="w-2/3" />}
          </div>
          <div className="text-muted-foreground">
            {property?.address ?? <SkeletonText className="w-1/4" />}
          </div>
          {property ? (
            <Badge>{plural(property.numRequests, "request")}</Badge>
          ) : (
            <Badge variant="skeleton" className="w-20" />
          )}
        </div>
      </div>
      <div className="space-y-2">
        {requests && property
          ? requests.map((request) => (
              <HostCityRequestCard
                key={request.id}
                request={request}
                property={property}
              />
            ))
          : null}
      </div>
    </div>
  );
}
