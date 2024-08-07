import Image from "next/image";
import { type LinkInputProperty } from "@/server/db/schema/tables/linkInputProperties";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function LinkInputPropertyCard({
  property,
}: {
  property: LinkInputProperty;
}) {
  return (
    <Link
      href={property.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-lg border @container hover:bg-zinc-100"
    >
      <div className="flex flex-col @sm:flex-row">
        <div className="relative h-36 overflow-hidden @sm:h-auto @sm:w-36">
          <Skeleton className="absolute inset-0" />
          <Image src={property.imageUrl} fill alt="" className="object-cover" />
        </div>
        <div className="flex-1 px-4 py-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <p>{property.listingSite}</p>
            <ExternalLinkIcon className="size-[1em]" />
          </div>
          <p className="line-clamp-1 font-semibold underline-offset-2 group-hover:underline @sm:line-clamp-2">
            {property.title}
          </p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {property.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
