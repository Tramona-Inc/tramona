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
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDateRange, getDaysUntilTrip } from "@/utils/utils";
import UserAvatar from "@/components/_common/UserAvatar";
import { MapPinIcon } from "lucide-react";

const formSchema = z.object({
  tripId: z.number(),
  reason: z.string(),
  cancelledAt: z.date(),
});

export default function TripCancellationOrPartialRefund({
  tripId,
}: {
  tripId: number;
}) {
  const { data } = api.trips.getMyTripsPageDetails.useQuery({ tripId });
  // check to see if the property is elgible for full refund or partial refund

  //form logic
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tripId: tripId,
      reason: "",
      cancelledAt: new Date(),
    },
  });
  return (
    <div className="flex flex-col gap-y-8">
      <h1 className="text-center text-2xl font-bold"> Cancel Your Trip </h1>
      {data && (
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
      )}
      <Form {...form}>
        <form className="flex flex-col gap-y-2">
          <FormLabel className="font-semibold text-black">
            Reason for Cancellation (Optional)
          </FormLabel>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Briefly explain why you need to cancel (optional)"
                />
              </FormControl>
            )}
          />
          <FormDescription>
            Please note: This action cannot be undone.{" "}
          </FormDescription>
          <Button type="submit" variant="destructive" className="self-end">
            Cancel Trip
          </Button>
        </form>
      </Form>
    </div>
  );
}
