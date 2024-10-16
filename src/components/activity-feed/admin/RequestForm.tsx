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
import PlacesInput from "@/components/_common/PlacesInput";
import { getNumNights } from "@/utils/utils";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import {
  createCreationTime,
  createRandomDate,
  createUserNameAndPic,
  randomizeLocationAndPrice,
} from "./generationHelper";

const formSchema = z.object({
  userName: z.string().min(1, "User name is required"),
  userProfilePicUrl: z.union([
    z.literal(""),
    z.string().trim().url("Must be a valid URL"),
  ]),
  checkIn: z.string().min(1, "Start date is required"),
  checkOut: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  entryCreationTime: z.string().min(1, "Request creation time is required"),
  maxNightlyPrice: z.number().min(1, "Nightly price must be at least 1"),
});

type FormSchema = z.infer<typeof formSchema>;

export default function CreateRequestForm({
  request,
  afterSubmit,
}: {
  request?: FeedRequestItem;
  afterSubmit?: () => void;
}) {
  const createFillerRequest = api.feed.createFillerRequest.useMutation();
  const updateFillerRequest = api.feed.updateFillerRequest.useMutation();
  const { refetch: refetchLocationAndPrice } =
    api.feed.getLocationAndPrice.useQuery(
      { atLeastNumOfEntries: 30 },
      { enabled: false },
    );

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...(request
        ? {
            userName: request.madeByGroup.owner.name ?? "",
            userProfilePicUrl: request.madeByGroup.owner.image ?? "",
            checkIn: request.checkIn.toISOString().slice(0, 10),
            checkOut: request.checkOut.toISOString().slice(0, 10),
            location: request.location,
            entryCreationTime: request.createdAt.toISOString().slice(0, 19),
            maxNightlyPrice:
              request.maxTotalPrice /
              getNumNights(request.checkIn, request.checkOut) /
              100,
          }
        : {
            userName: "",
            userProfilePicUrl: "",
            checkIn: "",
            checkOut: "",
            location: "",
            entryCreationTime: new Date()
              .toLocaleString("sv-SE", { timeZoneName: "short" })
              .replace(" ", "T")
              .slice(0, 19), // Set default to current time in user's time zone
            maxNightlyPrice: 0,
          }),
    },
  });

  async function onSubmit(data: FormSchema) {
    const formattedData = {
      ...data,
      entryCreationTime: new Date(data.entryCreationTime),
      maxTotalPrice:
        data.maxNightlyPrice * 100 * getNumNights(data.checkIn, data.checkOut),
      checkIn: new Date(data.checkIn), // Convert string to Date
      checkOut: new Date(data.checkOut),
    };
    // send the data to backend
    if (request) {
      await updateFillerRequest
        .mutateAsync({ id: request.id, ...formattedData })
        .catch(() => errorToast());
    } else {
      await createFillerRequest
        .mutateAsync(formattedData)
        .catch(() => errorToast());
    }
    afterSubmit?.();
  }

  const handleGenerateRandomData = async () => {
    const userData = await createUserNameAndPic();
    let userName = "";
    let userProfilePicUrl = "";
    if (userData[0]) {
      userName = userData[0].name;
      userProfilePicUrl = userData[0].picture;
    }
    const { checkIn, checkOut } = createRandomDate();
    const creationTime = createCreationTime();
    const promise = await refetchLocationAndPrice();
    const locationAndPrices = promise.data;

    form.setValue("entryCreationTime", creationTime);
    form.setValue("userName", userName);
    form.setValue("userProfilePicUrl", userProfilePicUrl);
    if (checkIn && checkOut) {
      form.setValue("checkIn", checkIn);
      form.setValue("checkOut", checkOut);
    }
    if (locationAndPrices) {
      const random = randomizeLocationAndPrice(locationAndPrices);
      if (random) {
        if (random.location) {
          form.setValue("location", random.location);
        }
        if (checkIn && checkOut) {
          form.setValue("maxNightlyPrice", random.nightlyPrice);
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <Button
          size="lg"
          type="button"
          onClick={handleGenerateRandomData}
          className="col-span-full"
        >
          Smart Generate
        </Button>

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
          name="maxNightlyPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Nightly Price</FormLabel>
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

        <PlacesInput
          control={form.control}
          name="location"
          formLabel="Location"
          variant="default"
          placeholder="Select a location"
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
          Confirm Request
        </Button>
      </form>
    </Form>
  );
}
