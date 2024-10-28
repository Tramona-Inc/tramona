import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RouterOutputs } from "@/utils/api";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils/utils";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut } from "lucide-react";
import RespondToClaimForm from "./RespondToClaimForm";
import {
  GetBadgeByClaimItemStatus,
  GetBadgeByClaimStatus,
} from "@/components/_common/BadgeFunctions";

type ClaimDetails = RouterOutputs["claims"]["getClaimWithAllDetailsById"];

function ImageGallery({ images }: { images: string[] }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <div className="mt-4">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <button className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 sm:h-20 sm:w-20 md:h-24 md:w-24">
                <Image
                  src={image}
                  alt={`Claim image ${index + 1}`}
                  fill
                  className="select-none object-cover object-center"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-h-[90vh] sm:max-w-[90vw]">
              <div
                className={`relative ${isZoomed ? "h-[70vh]" : "h-[50vh]"} w-full`}
              >
                <Image
                  src={image}
                  alt={`Claim image ${index + 1}`}
                  fill
                  objectFit={isZoomed ? "contain" : "cover"}
                />
                <button
                  onClick={toggleZoom}
                  className="absolute right-2 top-2 rounded-full bg-white p-2"
                >
                  {isZoomed ? (
                    <ZoomOut className="h-6 w-6" />
                  ) : (
                    <ZoomIn className="h-6 w-6" />
                  )}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}

function RespondToClaim({ claimDetails }: { claimDetails: ClaimDetails }) {
  return (
    <div className="mb-20 space-y-6 lg:mb-0">
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
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Claim ID</dt>
              <dd>{claimDetails.claim.id}</dd>
            </div>
            <div>
              <dt className="font-semibold">Trip ID</dt>
              <dd>{claimDetails.claim.tripId}</dd>
            </div>
            <div>
              <dt className="font-semibold">Filed By Host ID</dt>
              <dd>{claimDetails.claim.filedByHostId}</dd>
            </div>
            <div>
              <dt className="font-semibold">Created At</dt>
              <dd>{formatDate(claimDetails.claim.createdAt!, "PPP")}</dd>
            </div>
            <div>
              <dt className="font-semibold">Superhog Request ID</dt>
              <dd>{claimDetails.claim.superhogRequestId}</dd>
            </div>
            <div>
              <dt className="font-semibold">Reported Through Superhog At</dt>
              <dd>
                {formatDate(
                  claimDetails.claim.reportedThroughSuperhogAt!,
                  "PPP",
                )}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Claim Items and Resolutions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="mb-5 w-full">
            {claimDetails.claimItems.map((item) => {
              return (
                <AccordionItem value={`item-${item.id}`} key={item.id}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-4">
                      <span>{item.itemName}</span>
                      <div className="flex items-center space-x-2">
                        <span>{formatCurrency(item.requestedAmount)}</span>
                        <GetBadgeByClaimItemStatus
                          travelerClaimResponse={item.travelerClaimResponse}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex h-full w-full flex-col gap-y-4 px-4 sm:px-6 md:px-8 lg:flex-row lg:gap-x-6">
                      <div className="w-full space-y-4 lg:w-2/3">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <dt className="font-semibold">Requested Amount</dt>
                            <dd>{formatCurrency(item.requestedAmount)}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">
                              Outstanding Amount
                            </dt>
                            <dd>{formatCurrency(item.outstandingAmount!)}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Description</dt>
                            <dd>{item.description}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Created At</dt>
                            <dd>{formatDate(item.createdAt!, "PPP")}</dd>
                          </div>
                        </div>

                        <ImageGallery images={item.imageUrls} />
                      </div>
                      <Separator
                        className="h-300 hidden lg:block"
                        orientation="vertical"
                      />
                      <Separator className="lg:hidden" />
                      <div className="w-full lg:w-1/3">
                        <RespondToClaimForm claimItem={item} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default RespondToClaim;
