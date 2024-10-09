import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  formatDateRange,
  getDaysUntilTrip,
  getNumNights,
  removeTax,
} from "@/utils/utils";
import UserAvatar from "@/components/_common/UserAvatar";
import { MapPinIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TAX_PERCENTAGE } from "@/utils/constants";
import { Skeleton } from "@/components/ui/skeleton";
const formSchema = z.object({
  tripId: z.number(),
  reason: z.string().min(4, "Reason must be 5 characters or longer"),
  cancelledAt: z.date(),
  refundAmount: z.number().optional(),
});

export default function TripCancellationOrPartialRefund({
  tripId,
  partialRefundPercentage,
  description,
  totalPriceAfterFees,
}: {
  tripId: number;
  partialRefundPercentage: number;
  description?: string;
  totalPriceAfterFees: number;
}) {
  const { data, isLoading } = api.trips.getMyTripsPageDetails.useQuery({
    tripId,
  });
  const { data: isScrapedProperty } =
    api.offers.isOfferScrapedByTripId.useQuery(tripId);

  const { toast } = useToast();

  const { mutateAsync: cancelTrip, isLoading: isSubmitting } =
    api.trips.cancelTripById.useMutation({
      onSuccess: () => {
        toast({
          title: "Cancellation Successful",
          description:
            "Your trip cancellation has been processed. Please refer to your email for further information regarding your refund.",
          variant: "default",
        });
      },
    });

  // /-------------- Remove Tax and superhog from refund --------------
  const refundAmountBeforeRemovingTaxAndSuperhogAndStripe = data
    ? data.trip.totalPriceAfterFees
    : 0;
  console.log(refundAmountBeforeRemovingTaxAndSuperhogAndStripe);
  //extract stripe fee
  const stripeFee =
    refundAmountBeforeRemovingTaxAndSuperhogAndStripe -
    Math.round(
      (refundAmountBeforeRemovingTaxAndSuperhogAndStripe - 30) * 0.971,
    );
  console.log(stripeFee);

  let totalRefundAmount: number = !data
    ? 0
    : refundAmountBeforeRemovingTaxAndSuperhogAndStripe - stripeFee;

  let amountWithoutTaxAndStripe = 0;
  let superhogFees = 0;

  //if out property then we need to remove the superhog and tax  from the refund amount
  if (!isLoading && data) {
    if (!isScrapedProperty) {
      // Remove tax FIRST
      amountWithoutTaxAndStripe = removeTax(totalRefundAmount, TAX_PERCENTAGE);

      // Apply partial refund percentage
      const amountAfterPartialRefund =
        partialRefundPercentage !== 1
          ? amountWithoutTaxAndStripe * partialRefundPercentage
          : amountWithoutTaxAndStripe;

      const numOfNights = getNumNights(data.trip.checkIn, data.trip.checkOut);
      superhogFees = numOfNights * 300;
      totalRefundAmount = amountAfterPartialRefund - superhogFees; // Then subtract superhog fee
    }
  }

  //form logic
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripId: tripId,
      reason: "",
      cancelledAt: new Date(),
      refundAmount: totalRefundAmount,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await cancelTrip({
      tripId: data.tripId,
      reason: data.reason,
      refundAmount: totalRefundAmount,
    });
    return;
  }
  return (
    <div className="flex flex-col gap-y-5">
      <h1 className="text-center text-2xl font-bold"> Cancel Your Trip </h1>
      {isLoading ? (
        <Skeleton className="h-48 w-96 self-center rounded-xl" />
      ) : (
        data && (
          <div className="w-full">
            <div className="flex flex-col overflow-clip rounded-xl border shadow-md lg:flex-row">
              <div className="flex w-full flex-col gap-4 p-4 pt-12 lg:pt-4">
                <div className="flex w-full flex-col justify-start gap-3 lg:flex-row lg:gap-6">
                  <div className="flex flex-col gap-4 lg:gap-0">
                    <div className="flex justify-center sm:justify-start">
                      <Link
                        href={`/my-trips/${data.trip.id}`}
                        className="relative -mt-8 h-48 w-full sm:h-32 sm:w-52 lg:-mt-0"
                      >
                        <Image
                          fill
                          alt=""
                          className="rounded-md object-cover"
                          src={data.trip.property.imageUrls[0]!}
                        />
                        <Badge
                          variant="lightGray"
                          className="absolute left-2 top-3"
                        >
                          Trip in {getDaysUntilTrip(data.trip.checkIn)} days
                        </Badge>
                      </Link>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <UserAvatar
                        name={data.trip.property.host?.name}
                        image={
                          data.trip.property.host?.image ??
                          "/assets/images/tramona-logo.jpeg"
                        }
                      />
                      <div className="flex w-full justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Hosted by
                          </p>
                          <p>
                            {data.trip.property.host?.name
                              ? data.trip.property.host.name
                              : "Tramona"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-4">
                    <Link
                      href={`/my-trips/${data.trip.id}`}
                      className="text-xl font-bold lg:text-2xl"
                    >
                      {data.trip.property.name}
                    </Link>

                    <p className="flex flex-row items-center gap-x-1">
                      <MapPinIcon size={18} />
                      {data.trip.property.address}
                    </p>

                    <div className="">
                      <p>
                        {formatDateRange(data.trip.checkIn, data.trip.checkOut)}
                      </p>
                      <Link
                        href={`/my-trips/${data.trip.id}`}
                        className="text-sm font-bold underline underline-offset-4"
                      >
                        View more
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* <___________PARTIAL REFUNDS_________> */}
      <div>{partialRefundPercentage !== 1 && <div>{description}</div>}</div>
      {/* <___________REFUND Breakdown_________> */}
      <Card className="text-sm">
        <CardHeader>
          <h2 className="text-center font-semibold">Refund Breakdown</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between">
            <p>Total Trip Cost </p>{" "}
            <p>${(totalPriceAfterFees / 100).toFixed(2)}</p>
          </div>
          {!isScrapedProperty && amountWithoutTaxAndStripe && (
            <div className="flex flex-row justify-between">
              <p>Non-refundable Tax </p>{" "}
              <p>
                $
                {(
                  (totalPriceAfterFees -
                    (stripeFee + amountWithoutTaxAndStripe)) /
                  100
                ).toFixed(2)}
              </p>
            </div>
          )}
          {/* --------remove superhog if not scraped ------- */}
          <div className="flex flex-row justify-between">
            <p>Processing Fee </p>{" "}
            <p>${((stripeFee + superhogFees) / 100).toFixed(2)}</p>
          </div>
          {partialRefundPercentage !== 1 && (
            <div className="flex flex-row justify-between">
              <p>Cancellation Policy </p>{" "}
              <p>{partialRefundPercentage * 100}% Refund</p>
            </div>
          )}

          <Separator className="my-2" />
          <div className="font-semi flex flex-row justify-between">
            <p>Total Refund Amount </p>{" "}
            <p>${(totalRefundAmount / 100).toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
      <Form {...form}>
        <form
          className="flex flex-col gap-y-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormLabel className="font-semibold text-black">
            Reason for Cancellation
          </FormLabel>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Briefly explain why you need to cancel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage />
          <FormDescription>
            Please note: This action cannot be undone.{" "}
          </FormDescription>
          <Button
            type="submit"
            variant="destructive"
            className="self-end"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cancelling ..." : "Cancel Trip"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
