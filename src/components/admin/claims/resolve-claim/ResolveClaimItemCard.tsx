import React from "react";
import { formatDate } from "date-fns";
import { ClaimItem } from "@/server/db/schema";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetTravelerClaimResponseBadge } from "@/components/_common/BadgeFunctions";

interface ResolveClaimItemCardProps {
  claimItem: ClaimItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function ResolveClaimItemCard({
  claimItem,
  index,
  isSelected,
  onSelect,
}: ResolveClaimItemCardProps) {
  return (
    <div key={claimItem.id}>
      {index > 0 && <Separator className="my-8" />}
      <div
        onClick={() => {
          if (!claimItem.paymentCompleteAt) {
            onSelect();
          }
        }}
        className={`rounded-lg p-6 shadow-sm transition-all duration-200 ${
          claimItem.paymentCompleteAt
            ? "bg-green-50"
            : isSelected
              ? "cursor-pointer border-2 border-blue-200 bg-zinc-50"
              : "cursor-pointer bg-card hover:bg-zinc-100"
        }`}
      >
        <span className="sr-only">
          {claimItem.paymentCompleteAt
            ? "Completed claim item"
            : isSelected
              ? "Deselect this item"
              : "Select this item for resolution"}
        </span>
        <div className="mb-6 flex items-center justify-between border-b-2 pb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-bold text-primary">
              {claimItem.itemName}
            </h3>
            {claimItem.paymentCompleteAt && (
              <Badge variant="green" className="text-xs">
                Resolved
              </Badge>
            )}
          </div>
          <Badge
            variant={
              claimItem.paymentCompleteAt
                ? "green"
                : isSelected
                  ? "blue"
                  : "gray"
            }
          >
            Item {index + 1}
          </Badge>
        </div>

        <div
          className="relative mb-6 w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Carousel className="w-full">
            <CarouselContent>
              {claimItem.imageUrls.map((url, imgIndex) => (
                <CarouselItem key={imgIndex}>
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={url}
                      alt={`${claimItem.itemName} image ${imgIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Description
            </dt>
            <dd className="text-sm">{claimItem.description}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Requested Amount
            </dt>
            <dd className="text-lg font-semibold">
              {formatCurrency(claimItem.requestedAmount)}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Outstanding Amount
            </dt>
            <dd className="text-lg font-semibold">
              {formatCurrency(claimItem.outstandingAmount!)}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Property ID
            </dt>
            <dd className="text-sm">{claimItem.propertyId}</dd>
          </div>
        </dl>

        {claimItem.travelerClaimResponse && (
          <Card className="mt-6 bg-blue-50 bg-opacity-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg text-blue-700">
                <User className="mr-2 h-5 w-5" />
                Traveler&apos;s Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-blue-700">
                    Claim Response
                  </dt>
                  <GetTravelerClaimResponseBadge
                    travelerClaimResponse={claimItem.travelerClaimResponse}
                  />
                </div>
                <div className="space-y-1"></div>
                <div className="col-span-2 space-y-1">
                  <dt className="text-sm font-medium text-blue-700">
                    Response Description
                  </dt>
                  <dd className="text-sm">
                    {claimItem.travelerResponseDescription}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}

        {claimItem.paymentCompleteAt && (
          <div className="mt-6 space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Payment Completed
            </dt>
            <dd className="text-sm font-semibold text-green-600">
              <CheckCircle className="mr-1 inline-block h-4 w-4" />
              {formatDate(claimItem.paymentCompleteAt, "MMMM d, yyyy")}
            </dd>
          </div>
        )}

        {!claimItem.paymentCompleteAt && (
          <Button
            variant={isSelected ? "secondary" : "primary"}
            className="mt-4"
          >
            {isSelected ? "Selected for Resolution" : "Click to Resolve"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default ResolveClaimItemCard;
