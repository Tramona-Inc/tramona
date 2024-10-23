import React, { useState } from "react";
import { useRouter } from "next/router";
import { formatDate } from "date-fns";
import Image from "next/image";
import { api } from "@/utils/api";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import BackButton from "@/components/_common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/utils";
import ResolveClaimItemForm, {
  resolveItemFormSchema,
} from "@/components/admin/claims/ResolveClaimItemForm";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ClaimPropertyCard from "@/components/admin/claims/ClaimPropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";

export default function ResolveClaim() {
  const router = useRouter();
  const claimId = router.query.id as string;
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [submittedValues, setSubmittedValues] = useState<z.infer<
    typeof resolveItemFormSchema
  > | null>(null);

  const { data: claim, isLoading: isClaimLoading } =
    api.claims.getClaimWithAllDetailsById.useQuery(claimId, {
      enabled: !!claimId,
    });

  const { data: property, isLoading: isPropertyLoading } =
    api.properties.getById.useQuery(
      { id: claim?.claimItems[0]?.propertyId ?? 0 },
      {
        enabled: !!claim,
      },
    );

  const { mutateAsync: resolveClaimItem } =
    api.claims.resolveClaimItem.useMutation();

  const handleResolveClaimItemSubmit = async (
    values: z.infer<typeof resolveItemFormSchema>,
  ) => {
    if (!claimId || !selectedItemId) return;

    try {
      await resolveClaimItem(values);

      toast({
        title: "Item Resolved",
        description: "The claim item has been successfully resolved.",
      });

      setSubmittedValues(values);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error resolving the claim item.",
        variant: "destructive",
      });
      console.error("Error resolving claim item:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex w-full flex-row items-end justify-start">
          <BackButton href={`/admin/reports/claim-details/${claimId}`} />
          <h1 className="mx-auto text-3xl font-bold">Resolve Claim</h1>
        </div>

        {isClaimLoading || isPropertyLoading ? (
          <Card className="mb-4">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-1/2" />
                  <Skeleton className="mb-2 h-4 w-3/4" />
                  <Skeleton className="mb-2 h-4 w-2/3" />
                </div>
                <div className="flex-1">
                  <Skeleton className="mb-2 h-32 w-32 rounded-md" />
                  <Skeleton className="mb-2 h-4 w-1/2" />
                  <Skeleton className="mb-2 h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : claim && property ? (
          <ClaimPropertyCard claim={claim.claim} property={property} />
        ) : (
          <div>Claim or property not found</div>
        )}

        <Alert className="bg-zinc-white mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            This form is for resolving individual items in a claim, not the
            entire claim.
          </AlertDescription>
        </Alert>

        <div
          className={`grid gap-8 ${selectedItemId ? "lg:grid-cols-2" : "grid-cols-1"}`}
        >
          <Card className={selectedItemId ? "" : "col-span-full"}>
            <CardHeader>
              <CardTitle>Claim Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {isClaimLoading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <Separator className="my-8" />}
                      <div className="rounded-lg p-6 shadow-sm">
                        <Skeleton className="mb-4 h-8 w-3/4" />
                        <Skeleton className="mb-4 h-40 w-full" />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </React.Fragment>
                  ))
                ) : claim ? (
                  claim.claimItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Separator className="my-8" />}
                      <div
                        onClick={() => {
                          if (!item.paymentCompleteAt) {
                            setSelectedItemId(
                              selectedItemId === item.id! ? null : item.id!,
                            );
                            setSubmittedValues(null);
                          }
                        }}
                        className={`rounded-lg p-6 shadow-sm transition-all duration-200 ${
                          item.paymentCompleteAt
                            ? "bg-green-50"
                            : selectedItemId === item.id
                              ? "cursor-pointer border-2 border-blue-200 bg-zinc-50"
                              : "cursor-pointer bg-card hover:bg-zinc-100"
                        }`}
                      >
                        <span className="sr-only">
                          {item.paymentCompleteAt
                            ? "Completed claim item"
                            : selectedItemId === item.id!
                              ? "Deselect this item"
                              : "Select this item for resolution"}
                        </span>
                        <div className="mb-6 flex items-center justify-between border-b-2 pb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-3xl font-bold text-primary">
                              {item.itemName}
                            </h3>
                            {item.paymentCompleteAt && (
                              <Badge variant="green" className="text-xs">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <Badge
                            variant={
                              item.paymentCompleteAt
                                ? "green"
                                : selectedItemId === item.id!
                                  ? "blue"
                                  : "gray"
                            }
                          >
                            Item {index + 1}
                          </Badge>
                        </div>

                        <div className="relative mb-6 w-full">
                          <Carousel className="w-full">
                            <CarouselContent>
                              {item.imageUrls.map((url, imgIndex) => (
                                <CarouselItem key={imgIndex}>
                                  <div className="relative aspect-video overflow-hidden rounded-lg">
                                    <Image
                                      src={url}
                                      alt={`${item.itemName} image ${imgIndex + 1}`}
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
                            <dd className="text-sm">{item.description}</dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Requested Amount
                            </dt>
                            <dd className="text-lg font-semibold">
                              {formatCurrency(item.requestedAmount)}
                            </dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Outstanding Amount
                            </dt>
                            <dd className="text-lg font-semibold">
                              {formatCurrency(item.outstandingAmount!)}
                            </dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="text-sm font-medium text-muted-foreground">
                              Property ID
                            </dt>
                            <dd className="text-sm">{item.propertyId}</dd>
                          </div>
                          {item.paymentCompleteAt && (
                            <div className="col-span-2 space-y-1">
                              <dt className="text-sm font-medium text-muted-foreground">
                                Payment Completed
                              </dt>
                              <dd className="text-sm font-semibold text-green-600">
                                <CheckCircle className="mr-1 inline-block h-4 w-4" />
                                {formatDate(
                                  item.paymentCompleteAt,
                                  "MMMM d, yyyy",
                                )}
                              </dd>
                            </div>
                          )}
                        </dl>

                        {!item.paymentCompleteAt && (
                          <Button
                            variant={
                              selectedItemId === item.id!
                                ? "secondary"
                                : "primary"
                            }
                            className="mt-4"
                          >
                            {selectedItemId === item.id!
                              ? "Selected for Resolution"
                              : "Click to Resolve"}
                          </Button>
                        )}
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <div>No claim items found</div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedItemId && claim && (
            <Card>
              <CardContent>
                {submittedValues ? (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">
                      Resolution Summary
                    </h3>
                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Resolution Result
                        </dt>
                        <dd className="text-sm font-semibold">
                          {submittedValues.resolutionResult}
                        </dd>
                      </div>
                      <div className="space-y-1">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Approved Amount
                        </dt>
                        <dd className="text-sm font-semibold">
                          {formatCurrency(submittedValues.approvedAmount)}
                        </dd>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <dt className="text-sm font-medium text-muted-foreground">
                          Resolution Description
                        </dt>
                        <dd className="text-sm">
                          {submittedValues.resolutionDescription}
                        </dd>
                      </div>
                    </dl>
                    <Button
                      onClick={() => setSubmittedValues(null)}
                      className="mt-4"
                    >
                      Edit Resolution
                    </Button>
                  </div>
                ) : (
                  <ResolveClaimItemForm
                    claimItem={
                      claim.claimItems.find(
                        (item) => item.id === selectedItemId,
                      )!
                    }
                    onSubmit={handleResolveClaimItemSubmit}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
