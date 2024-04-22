import { SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { MapPinIcon } from "lucide-react";
import { useRouter } from "next/router";

export default function HostRequests() {
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: requests } = api.requests.getByPropertyId.useQuery(propertyId);
  const { data: properties } = api.properties.getHostRequestsSidebar.useQuery();
  const property = properties?.find((p) => p.id === propertyId);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <MapPinIcon />
        <div className="flex-1 text-xl">
          {property ? (
            <h2 className="font-bold">{property.name}</h2>
          ) : (
            <SkeletonText className="w-2/3" />
          )}
        </div>
      </div>
    </div>
  );
}
