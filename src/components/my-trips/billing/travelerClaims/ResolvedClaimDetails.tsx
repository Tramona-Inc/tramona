import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "date-fns";
import { cn, formatCurrency } from "@/utils/utils";
import type { RouterOutputs } from "@/utils/api";
import {
  FileText,
  Calendar,
  DollarSign,
  User,
  CheckCircle,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GetBadgeByClaimStatus } from "@/components/_common/BadgeFunctions";

export type ClaimDetails =
  RouterOutputs["claims"]["getClaimWithAllDetailsById"];

interface ResolvedClaimDetailsProps {
  claimDetails: ClaimDetails;
}

function ImageCarousel({
  images,
  itemName,
  className,
}: {
  images: string[];
  itemName: string;
  className?: string;
}) {
  return (
    <div className="h-52 w-full max-w-xs">
      <Carousel className={cn("h-full w-full", className)}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-48 w-full p-1">
                <Image
                  src={image}
                  alt={`Image ${index + 1} of ${itemName}`}
                  fill
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
    </div>
  );
}

export default function ResolvedClaimDetails({
  claimDetails,
}: ResolvedClaimDetailsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Claim Information</span>
            <GetBadgeByClaimStatus
              claimStatus={claimDetails.claim.claimStatus}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="font-semibold">Claim ID</dt>
                <dd>{claimDetails.claim.id}</dd>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="font-semibold">Trip ID</dt>
                <dd>{claimDetails.claim.tripId}</dd>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="font-semibold">Created At</dt>
                <dd>{formatDate(claimDetails.claim.createdAt!, "PPP")}</dd>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="font-semibold">Resolved At</dt>
                <dd>
                  {claimDetails.claim.resolvedAt
                    ? formatDate(claimDetails.claim.resolvedAt, "PPP")
                    : "N/A"}
                </dd>
              </div>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Claim Items and Resolutions</CardTitle>
        </CardHeader>
        <CardContent>
          {claimDetails.claimItems.map((item, index) => {
            const resolution = claimDetails.claimItemResolutions.find(
              (res) => res.claimItemId === item.id,
            );
            return (
              <div key={item.id} className="mb-6">
                <h3 className="mb-2 text-xl font-semibold">{item.itemName}</h3>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <ImageCarousel
                        images={item.imageUrls}
                        itemName={item.itemName}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <dt className="font-semibold">Requested Amount</dt>
                            <dd>{formatCurrency(item.requestedAmount)}</dd>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <dt className="font-semibold">
                              Outstanding Amount
                            </dt>
                            <dd>{formatCurrency(item.outstandingAmount!)}</dd>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <dt className="font-semibold">Created At</dt>
                            <dd>{formatDate(item.createdAt!, "PPP")}</dd>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <dt className="font-semibold">
                              Payment Complete At
                            </dt>
                            <dd>
                              {item.paymentCompleteAt
                                ? formatDate(item.paymentCompleteAt, "PPP")
                                : "N/A"}
                            </dd>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <dt className="font-semibold">Description</dt>
                      <dd className="text-sm">{item.description}</dd>
                    </div>
                  </div>
                  {resolution && (
                    <Card className="h-fit bg-green-50">
                      <CardHeader className="py-2">
                        <CardTitle className="flex items-center text-lg text-green-700">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Resolved
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-2">
                        <dl className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <dt className="font-semibold text-green-700">
                              Result
                            </dt>
                            <dd className="text-green-800">
                              {resolution.resolutionResult}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-green-700">
                              Resolved By
                            </dt>
                            <dd className="text-green-800">
                              Admin ID: {resolution.resolvedByAdminId}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-green-700">
                              Description
                            </dt>
                            <dd className="text-green-800">
                              {resolution.resolutionDescription}
                            </dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  )}
                </div>
                {index < claimDetails.claimItems.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
