import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, formatDate } from "date-fns";
import Image from "next/image";
import { api } from "@/utils/api";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import BackButton from "@/components/_common/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/utils";

const formSchema = z.object({
  resolutionResult: z.enum(["Approved", "Denied", "Partially Approved"]),
  resolutionDescription: z
    .string()
    .min(1, "Resolution description is required"),
  approvedAmount: z.number().min(0, "Approved amount must be 0 or greater"),
});

export default function ResolveClaim() {
  const router = useRouter();
  const claimId = router.query.id as string;

  const { data: claim, isLoading } =
    api.claims.getClaimWithAllDetailsById.useQuery(claimId, {
      enabled: !!claimId,
    });

  const { data: property } = api.properties.getById.useQuery(
    { id: claim?.claimItems[0]?.propertyId ?? 0 },
    {
      enabled: !!claim,
    },
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resolutionResult: "Approved",
      resolutionDescription: "",
      approvedAmount: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Here you would typically call your API to submit the form data
    // api.claims.resolveClaim.mutate({ claimId, ...values });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!claim) {
    return <div>Claim not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <BackButton href={`/admin/reports/claim-details/${claimId}`} />
        <h1 className="mb-8 text-3xl font-bold">Resolve Claim</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Claim and Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  Claim Information
                </h2>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold">Claim ID</dt>
                    <dd>{claim.claim.id}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Trip ID</dt>
                    <dd>{claim.claim.tripId}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Filed By Host ID</dt>
                    <dd>{claim.claim.filedByHostId}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Created At</dt>
                    <dd>{formatDate(claim.claim.createdAt!, "MM/dd/yyyy")}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Status</dt>
                    <dd>{claim.claim.claimStatus}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Superhog Request ID</dt>
                    <dd>{claim.claim.superhogRequestId}</dd>
                  </div>
                </dl>
              </div>
              {property && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Property Information
                  </h2>
                  <div className="mb-4 flex items-center">
                    <div className="relative mr-4 h-24 w-24">
                      <Image
                        src={property.imageUrls[0]!}
                        alt={property.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{property.name}</h3>
                      <p className="text-sm text-gray-500">
                        {property.address}
                      </p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="font-semibold">Property ID</dt>
                      <dd>{property.id}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Host ID</dt>
                      <dd>{property.hostId ?? "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Listing Platform</dt>
                      <dd>{property.originalListingPlatform ?? "N/A"}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Resolve Claim</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
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
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Denied">Denied</SelectItem>
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
                            {...field}
                            placeholder="Enter resolution description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="approvedAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approved Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit Resolution</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Claim Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {claim.claimItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <Separator className="my-6" />}
                    <div className="rounded-lg bg-muted p-4">
                      <h3 className="mb-4 text-lg font-semibold">
                        Item {index + 1}
                      </h3>
                      <dl className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <dt className="font-semibold">Description</dt>
                          <dd>{item.description}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Requested Amount</dt>
                          <dd>{formatCurrency(item.requestedAmount)}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Outstanding Amount</dt>
                          <dd>{formatCurrency(item.outstandingAmount!)}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Property ID</dt>
                          <dd>{item.propertyId}</dd>
                        </div>
                      </dl>
                      <Carousel className="w-full max-w-xs">
                        <CarouselContent>
                          {item.imageUrls.map((url, imgIndex) => (
                            <CarouselItem key={imgIndex}>
                              <div className="relative aspect-square">
                                <Image
                                  src={url}
                                  alt={`Claim item ${index + 1} image ${imgIndex + 1}`}
                                  fill
                                  className="rounded-md object-cover"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </div>
                  </React.Fragment>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
