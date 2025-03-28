import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getNumNights, getPropertyId } from "@/utils/utils";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { type FeedBookingItem } from "@/components/activity-feed/ActivityFeed";
import { zodUrl, zodString, optional } from "@/utils/zod-utils";

const formSchema = z.object({
  userName: zodString(),
  userProfilePicUrl: optional(zodUrl()),
  checkIn: zodString(),
  checkOut: zodString(),
  propertyUrl: zodUrl(),
  entryCreationTime: zodString(),
  nightlyPrice: z.number().min(1, "Nightly price must be at least 1"),
  originalNightlyPrice: z
    .number()
    .min(0, "will use the propertys nightly price if set to 0"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateBookingForm({
  booking,
  afterSubmit,
}: {
  booking?: FeedBookingItem;
  afterSubmit?: () => void;
}) {
  const createFillerBooking = api.feed.createFillerBooking.useMutation();
  const updateFillerBooking = api.feed.updateFillerBooking.useMutation();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(booking
        ? {
            userName: booking.group.owner.firstName ?? "",
            userProfilePicUrl: booking.group.owner.image ?? "",
            checkIn: booking.checkIn.toISOString().slice(0, 10),
            checkOut: booking.checkOut.toISOString().slice(0, 10),
            propertyUrl:
              "https://www.tramona.com/property/" + booking.property.id,
            entryCreationTime: booking.createdAt.toISOString().slice(0, 19),
            nightlyPrice:
              (booking.offer?.totalBasePriceBeforeFees ?? 0) /
              getNumNights(booking.checkIn, booking.checkOut) /
              100,
            originalNightlyPrice:
              (booking.property.originalNightlyPrice ?? 0) / 100 || 0,
          }
        : {
            userName: "",
            userProfilePicUrl: "",
            checkIn: "",
            checkOut: "",
            propertyUrl: "",
            entryCreationTime: new Date()
              .toLocaleString("sv-SE", { timeZoneName: "short" })
              .replace(" ", "T")
              .slice(0, 19), // Set default to current time in user's time zone
            nightlyPrice: 0,
            originalNightlyPrice: 0,
          }),
    },
  });

  async function onSubmit(data: FormSchema) {
    const formattedData = {
      ...data,
      entryCreationTime: new Date(data.entryCreationTime),
      maxTotalPrice:
        data.nightlyPrice * 100 * getNumNights(data.checkIn, data.checkOut),
      propertyId: getPropertyId(data.propertyUrl) ?? 0,
      checkIn: new Date(data.checkIn), // Convert string to Date
      checkOut: new Date(data.checkOut),
    };
    // send the data to backend
    if (booking) {
      await updateFillerBooking
        .mutateAsync({ id: booking.id, ...formattedData })
        .catch(() => errorToast());
    } else {
      await createFillerBooking
        .mutateAsync(formattedData)
        .catch(() => errorToast());
    }
    afterSubmit?.();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userProfilePicUrl"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>User Profile Pic URL (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://example.com/profile-pic.jpg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Travel Start Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Travel End Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nightlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nightly Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  inputMode="decimal"
                  prefix="$"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originalNightlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Original Nightly Price (if not specify, will use the propertys
                nightly price)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  inputMode="decimal"
                  prefix="$"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyUrl"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tramona Property URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://www.tramona.com/property/4959"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entryCreationTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel> CreatedAt (By default current time)</FormLabel>
              <FormControl>
                <Input {...field} type="datetime-local" step="1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button size="lg" type="submit" className="col-span-full">
          Confirm Booking
        </Button>
      </form>
    </Form>
  );
}
