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
import {
  ALL_PROPERTY_AMENITIES,
  ALL_PROPERTY_SAFETY_ITEMS,
  ALL_PROPERTY_STANDOUT_AMENITIES,
  ALL_PROPERTY_TYPES,
  type Request,
} from "@/server/db/schema";
import { api } from "@/utils/api";
import { errorToast, successfulAdminOfferToast } from "@/utils/toasts";
import { capitalize } from "@/utils/utils";
import { zodInteger, zodNumber, zodString } from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TagSelect from "../_common/TagSelect";
import { Dropzone } from "../_utils/Dropzone";
import type { DropzoneRef } from "../_utils/Dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { env } from "@/env";

export default function AdminOfferForm({
  afterSubmit,
  request,
}: {
  afterSubmit?: () => void;
  request: Request;
}) {
  const ref = useRef<DropzoneRef>(null);

  const formSchema = z.object({
    propertyName: zodString(),
    offeredPriceUSD: zodInteger({ min: 1 }),
    hostName: zodString(),
    maxNumGuests: zodInteger({ min: 1 }),
    numBeds: zodInteger({ min: 1 }),
    numBedrooms: zodInteger({ min: 1 }),
    propertyType: z.enum(ALL_PROPERTY_TYPES),
    originalNightlyPriceUSD: zodInteger(),
    avgRating: zodNumber({ min: 0, max: 5 }),
    numRatings: zodInteger({ min: 1 }),
    amenities: z.enum(ALL_PROPERTY_AMENITIES).array(),
    standoutAmenities: z.enum(ALL_PROPERTY_STANDOUT_AMENITIES).array(),
    safetyItems: z.enum(ALL_PROPERTY_SAFETY_ITEMS).array(),
    about: zodString({ maxLen: Infinity }),
    airbnbUrl: zodString({ maxLen: Infinity }).url(),
  });

  type FormSchema = z.infer<typeof formSchema>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amenities: [],
      standoutAmenities: [],
      safetyItems: [],
    },
  });

  const propertiesMutation = api.properties.create.useMutation();
  const offersMutation = api.offers.create.useMutation();

  const utils = api.useUtils();

  async function onSubmit(data: FormSchema) {
    const { offeredPriceUSD, ...propertyData } = data;

    try {
      await ref.current!.uploadS3();
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message);
      }
    }

    const newProperty = {
      ...propertyData,
      name: propertyData.propertyName,
      type: propertyData.propertyType,
      originalNightlyPrice: propertyData.originalNightlyPriceUSD * 100,
      imageUrls: ref.current!.hashKeys.map(
        (key) =>
          `https://${env.NEXT_PUBLIC_BUCKET_NAME}.s3.amazonaws.com/${key}`,
      ),
    };

    try {
      const propertyId = await propertiesMutation
        .mutateAsync(newProperty)
        .catch((error) => {
          if (error instanceof TRPCClientError) {
            throw new Error(error.message);
          }
        });

      if (!propertyId) {
        throw new Error("Could not create property, please try again");
      }

      const newOffer = {
        requestId: request.id,
        propertyId: propertyId,
        totalPrice: offeredPriceUSD * 100,
      };

      await offersMutation.mutateAsync(newOffer);

      await Promise.all([
        utils.properties.invalidate(),
        utils.offers.invalidate(),
        utils.requests.invalidate(),
      ]);

      successfulAdminOfferToast({
        propertyName: newProperty.name,
        totalPrice: newOffer.totalPrice,
        checkIn: request.checkIn,
        checkOut: request.checkOut,
      });
      afterSubmit?.();
    } catch (error) {
      if (error instanceof Error) {
        errorToast(error.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="propertyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hostName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="originalNightlyPriceUSD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property&apos;s original price (nightly)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="decimal"
                  prefix="$"
                  suffix="/night"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offeredPriceUSD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offered price (total)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="decimal"
                  prefix="$"
                  suffix="total"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ALL_PROPERTY_TYPES.map((propertyType) => (
                    <SelectItem key={propertyType} value={propertyType}>
                      {capitalize(propertyType)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxNumGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity (max # of guests)</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numBeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beds</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numBedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avgRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average rating</FormLabel>
              <FormControl>
                <Input {...field} inputMode="decimal" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numRatings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of ratings</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <TagSelect
                  options={ALL_PROPERTY_AMENITIES}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="standoutAmenities"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Standout Amenities</FormLabel>
              <FormControl>
                <TagSelect
                  options={ALL_PROPERTY_STANDOUT_AMENITIES}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="safetyItems"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Safety Items</FormLabel>
              <FormControl>
                <TagSelect
                  options={ALL_PROPERTY_SAFETY_ITEMS}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>About property</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-y" rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="airbnbUrl"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Airbnb URL</FormLabel>
              <FormControl>
                <Input {...field} inputMode="url" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dropzone ref={ref} />

        <Button
          disabled={form.formState.isSubmitting}
          size="lg"
          type="submit"
          className="col-span-full"
        >
          Make offer
        </Button>
      </form>
    </Form>
  );
}
