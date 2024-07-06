import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/utils/api";

export default function HostPropertiesOverview({
  className,
}: {
  className?: string;
}) {
  const { data: properties } = api.properties.getHostProperties.useQuery();

  const listedProperties = properties?.filter(
    (property) => property.propertyStatus === "Listed",
  );
  const archivedProperties = properties?.filter(
    (property) => property.propertyStatus === "Archived",
  );
  const draftedProperties = properties?.filter(
    (property) => property.propertyStatus === "Drafted",
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Properties</CardTitle>
      </CardHeader>
      <CardContent className="@container">
        <div className="flex flex-row gap-4 text-lg font-semibold sm:flex-col">
          <div className="flex-1 items-center justify-between rounded-lg border p-4 sm:flex">
            <p>Listed</p>
            <p className="text-2xl font-bold">{listedProperties?.length}</p>
          </div>
          <div className="flex-1 items-center justify-between rounded-lg border p-4 sm:flex">
            <p>Drafts</p>
            <p className="text-2xl font-bold">{draftedProperties?.length}</p>
          </div>
          <div className="flex-1 items-center justify-between rounded-lg border p-4 sm:flex">
            <p>Archived</p>
            <p className="text-2xl font-bold">{archivedProperties?.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
