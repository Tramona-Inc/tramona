import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { EditIcon } from "lucide-react";
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
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-bold">Properties</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="@container">
        <div className="flex flex-col gap-4 text-lg font-semibold">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <p>Listed</p>
            <p className="text-2xl font-bold">{listedProperties?.length}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <p>Drafts</p>
            <p className="text-2xl font-bold">{draftedProperties?.length}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <p>Archive</p>
            <p className="text-2xl font-bold">{archivedProperties?.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
