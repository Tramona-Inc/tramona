/* eslint-disable @next/next/no-img-element */
import React from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  DollarSignIcon,
  HomeIcon,
  GroupIcon,
  MapPinIcon,
} from "lucide-react";

import { type RouterOutputs } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";

type ClaimDetailsOutput =
  RouterOutputs["claims"]["getClaimDetailsWPropertyById"];

interface ClaimDetailsCardProps {
  claimDetails: ClaimDetailsOutput;
}

export default function ClaimDetailsCard({
  claimDetails,
}: ClaimDetailsCardProps) {
  return (
    <>
      {claimDetails ? (
        <Card className="mb-6 overflow-hidden">
          <CardHeader className="rounded-2xl border p-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Claim Details</CardTitle>
                <CardDescription>
                  Review the existing claim details below
                </CardDescription>
              </div>
              <Badge
                className="text-lg"
                variant={
                  claimDetails.claimStatus === "In Review" ? "green" : "yellow"
                }
              >
                {claimDetails.claimStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-lg font-semibold">
                  Claim Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Claim ID:</span>
                    <span className="font-medium">
                      {claimDetails.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span className="font-medium">
                      {format(new Date(claimDetails.createdAt), "PPP")}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">Property Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HomeIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {claimDetails.trip.property.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {claimDetails.trip.property.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Separator className="my-6" />
            <div>
              <h3 className="mb-4 text-lg font-semibold">Trip Details</h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <CalendarIcon className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-semibold">
                      {format(
                        new Date(claimDetails.trip.checkIn),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <CalendarIcon className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-semibold">
                      {format(
                        new Date(claimDetails.trip.checkOut),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <GroupIcon className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-semibold">
                      {claimDetails.trip.numGuests}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <DollarSignIcon className="mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-semibold">
                      $
                      {(claimDetails.trip.totalPriceAfterFees / 100).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Spinner />
      )}
    </>
  );
}
