import React, { useState } from "react";
import Image from "next/image";
import { api } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RouterOutputs } from "@/utils/api";
import { formatDate } from "date-fns";
import { formatCurrency } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ZoomIn, ZoomOut } from "lucide-react";

type ClaimDetails = RouterOutputs["claims"]["getClaimWithAllDetailsById"];

const resolutionSchema = z.object({
  resolutionResult: z.enum(["Accepted", "Rejected", "Partially Approved"]),
  resolutionDescription: z.string().min(1, "Description is required"),
});

type ResolutionFormData = z.infer<typeof resolutionSchema>;

function ImageGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <div className="mt-4">
      <div className="flex space-x-2 overflow-x-auto">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <button
                className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Claim image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-h-[90vh] sm:max-w-[90vw]">
              {/* THIS IS SO UGLY PLEASE SOMEBODY FIX IT  */}
              <div
                className={`relative ${isZoomed ? "h-[70vh]" : "h-[50vh]"} w-full`}
              >
                <Image
                  src={image}
                  alt={`Claim image ${index + 1}`}
                  layout="fill"
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
  const onSubmit = async (values: ResolutionFormData, itemId: string) => {
    console.log(itemId, values);
    // Here you would typically call your API to submit the form data
    // api.claims.resolveClaimItem.mutate({ claimId: claimDetails.claim.id, claimItemId: itemId, ...values });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Claim Information</span>
            <Badge>{claimDetails.claim.claimStatus}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle>Claim Items and Resolutions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {claimDetails.claimItems.map((item, index) => {
              const form = useForm<ResolutionFormData>({
                resolver: zodResolver(resolutionSchema),
                defaultValues: {
                  resolutionResult: "Accepted",
                  resolutionDescription: "",
                },
              });

              return (
                <AccordionItem value={`item-${item.id}`} key={item.id}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-4">
                      <span>{item.itemName}</span>
                      <div className="flex items-center space-x-2">
                        <span>{formatCurrency(item.requestedAmount)}</span>
                        <Badge
                          variant={
                            item.travelerClaimResponse ? "yellow" : "red"
                          }
                          className="text-xs"
                        >
                          {item.travelerClaimResponse
                            ? "Needs Attention"
                            : "In Review"}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <dt className="font-semibold">Requested Amount</dt>
                          <dd>{formatCurrency(item.requestedAmount)}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Outstanding Amount</dt>
                          <dd>{formatCurrency(item.outstandingAmount!)}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Created At</dt>
                          <dd>{formatDate(item.createdAt!, "PPP")}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Payment Complete At</dt>
                          <dd>
                            {item.paymentCompleteAt
                              ? formatDate(item.paymentCompleteAt, "PPP")
                              : "N/A"}
                          </dd>
                        </div>
                      </div>
                      <div>
                        <dt className="font-semibold">Description</dt>
                        <dd>{item.description}</dd>
                      </div>
                      <ImageGallery images={item.imageUrls} />
                      <Separator className="my-4" />
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit((values) =>
                            onSubmit(values, item.id),
                          )}
                          className="space-y-4"
                        >
                          <FormField
                            control={form.control}
                            name="resolutionResult"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resolution Result</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a resolution result" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Accepted">
                                      Accepted
                                    </SelectItem>
                                    <SelectItem value="Rejected">
                                      Rejected
                                    </SelectItem>
                                    <SelectItem value="Partially Approved">
                                      Partially Approved
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="resolutionDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Resolution Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Provide details about the resolution"
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Explain the reasons for your decision and any
                                  relevant details.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Submit Resolution</Button>
                        </form>
                      </Form>
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
