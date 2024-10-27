import React from "react";
import Image from "next/image";
import { formatDate } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HomeIcon, UserIcon } from "lucide-react";
import type { Claim, Property } from "@/server/db/schema";

export default function ClaimPropertyCard({
  claim,
  property,
}: {
  claim: Claim;
  property: Property;
}) {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardHeader className="border-b pb-2 pt-3">
        <CardTitle className="text-base font-medium">
          Claim and Property Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-4">
            <h2 className="mb-2 text-sm font-semibold">Claim Information</h2>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div className="col-span-2 flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <dt className="font-medium text-muted-foreground">Created:</dt>
                <dd className="font-semibold">
                  {formatDate(claim.createdAt!, "MM/dd/yyyy")}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Claim ID:</dt>
                <dd className="font-semibold">{claim.id}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Trip ID:</dt>
                <dd className="font-semibold">{claim.tripId}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">
                  Filed By Host ID:
                </dt>
                <dd className="font-semibold">{claim.filedByHostId}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Status:</dt>
                <dd className="font-semibold">{claim.claimStatus}</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-muted-foreground">
                  Superhog Request ID:
                </dt>
                <dd className="font-semibold">{claim.superhogRequestId}</dd>
              </div>
            </dl>
          </div>
          <div className="flex-1 bg-muted/30 p-4">
            <h2 className="mb-2 text-sm font-semibold">Property Information</h2>
            <div className="mb-4 flex items-start space-x-4">
              <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md">
                {property.imageUrls[0] && (
                  <Image
                    src={property.imageUrls[0]}
                    alt={property.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{property.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {property.address}
                </p>
                <div className="mt-2 flex items-center space-x-2 text-xs">
                  <HomeIcon className="h-3 w-3" />
                  <span className="font-medium text-muted-foreground">
                    Property ID:
                  </span>
                  <span className="font-semibold">{property.id}</span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-xs">
                  <UserIcon className="h-3 w-3" />
                  <span className="font-medium text-muted-foreground">
                    Host ID:
                  </span>
                  <span className="font-semibold">
                    {property.hostId ?? "N/A"}
                  </span>
                </div>
                <div className="mt-1 flex items-center space-x-2 text-xs">
                  <span className="font-medium text-muted-foreground">
                    Listing Platform:
                  </span>
                  <span className="font-semibold">
                    {property.originalListingPlatform ?? "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
