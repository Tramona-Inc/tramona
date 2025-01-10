import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { api } from "@/utils/api";

export default function HostPropertiesOverview({
  currentHostTeamId,
}: {
  currentHostTeamId: number | null | undefined;
}) {
  const { data: properties } = api.properties.getHostProperties.useQuery(
    { currentHostTeamId: currentHostTeamId! },
    { enabled: !!currentHostTeamId },
  );

  const listedProperties = properties?.filter(
    (property) => property.status === "Listed",
  );
  const archivedProperties = properties?.filter(
    (property) => property.status === "Archived",
  );
  const draftedProperties = properties?.filter(
    (property) => property.status === "Drafted",
  );
  return (
    <div className="flex w-full flex-col items-start gap-y-5">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <h2 className="text-4xl font-semibold">Properties</h2>
        <Button variant="ghost" asChild>
          <Link href="/host/properties">
            See all
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
      <div className="grid w-full grid-cols-3 gap-4">
        <div className="col-span-1 space-y-5 rounded-lg border p-4 sm:col-span-1">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Listed
          </p>
          <p className="text-4xl font-bold">{listedProperties?.length}</p>
        </div>
        <div className="space-y-5 rounded-lg border p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Drafts
          </p>
          <p className="text-4xl font-bold">{draftedProperties?.length}</p>
        </div>
        <div className="space-y-5 rounded-lg border p-4">
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Archives
          </p>
          <p className="text-4xl font-bold">{archivedProperties?.length}</p>
        </div>
      </div>
    </div>
  );
}
