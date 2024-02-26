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
import { capitalize, plural } from "@/utils/utils";
import {
  optional,
  zodInteger,
  zodNumber,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import TagSelect from "../_common/TagSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { type OfferWithProperty } from "../requests/[id]/OfferCard";

import { getNumNights } from "@/utils/utils";

const formSchema = z.object({
  propertyName: zodString(),
  offeredPriceUSD: optional(zodInteger({ min: 1 })),
  hostName: zodString(),
  address: optional(zodString({ maxLen: 1000 })),
  maxNumGuests: zodInteger({ min: 1 }),
  numBeds: zodInteger({ min: 1 }),
  numBedrooms: zodInteger({ min: 1 }),
  propertyType: z.enum(ALL_PROPERTY_TYPES),
  originalNightlyPriceUSD: zodInteger(),
  offeredNightlyPriceUSD: zodInteger({ min: 1 }),
  avgRating: zodNumber({ min: 0, max: 5 }),
  numRatings: zodInteger({ min: 1 }),
  amenities: z.enum(ALL_PROPERTY_AMENITIES).array(),
  standoutAmenities: z.enum(ALL_PROPERTY_STANDOUT_AMENITIES).array(),
  safetyItems: z.enum(ALL_PROPERTY_SAFETY_ITEMS).array(),
  about: zodString({ maxLen: Infinity }),
  airbnbUrl: optional(zodUrl()),
  imageUrls: z.object({ value: zodUrl() }).array(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function AdminOfferForm({
  afterSubmit,
  request,
  // pass it the current offer data to turn it from a "create offer" form
  // to an autofilled "update offer" form
  offer,
}: {
  afterSubmit?: () => void;
  request: Request;
  offer?: OfferWithProperty;
}) {
  const numberOfNights = getNumNights(request.checkIn, request.checkOut);
  const offeredNightlyPriceUSD = offer
    ? Math.round(offer.totalPrice / numberOfNights / 100)
    : 1;

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrls: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      amenities: [],
      standoutAmenities: [],
      safetyItems: [],
      ...(offer
        ? {
            // im sorry
            // ?? undefineds are to turn string | null into string | undefined
            hostName: offer.property.hostName ?? undefined,
            address: offer.property.address ?? undefined,
            maxNumGuests: offer.property.maxNumGuests,
            numBeds: offer.property.numBeds,
            numBedrooms: offer.property.numBedrooms,
            propertyType: offer.property.propertyType,
            avgRating: offer.property.avgRating,
            numRatings: offer.property.numRatings,
            amenities: offer.property.amenities,
            standoutAmenities: offer.property.standoutAmenities,
            safetyItems: offer.property.safetyItems,
            about: offer.property.about,
            airbnbUrl: offer.property.airbnbUrl ?? undefined,
            propertyName: offer.property.name,
            offeredPriceUSD: offer.totalPrice / 100,
            offeredNightlyPriceUSD: offeredNightlyPriceUSD ?? undefined,
            originalNightlyPriceUSD: offer.property.originalNightlyPrice / 100,
            imageUrls: offer.property.imageUrls.map((url) => ({ value: url })),
          }
        : {}),
    },
  });

  const imageUrlInputs = useFieldArray({
    name: "imageUrls",
    control: form.control,
  });

  const updatePropertiesMutation = api.properties.update.useMutation();
  const updateOffersMutation = api.offers.update.useMutation();
  const createPropertiesMutation = api.properties.create.useMutation();
  const createOffersMutation = api.offers.create.useMutation();

  const utils = api.useUtils();

  async function onSubmit(data: FormSchema) {
    const { offeredNightlyPriceUSD: _, ...propertyData } = data;

    // const totalPrice = offeredPriceUSD * 100;
    const totalPrice = data.offeredNightlyPriceUSD * numberOfNights * 100;

    const newProperty = {
      ...propertyData,
      name: propertyData.propertyName,
      type: propertyData.propertyType,
      originalNightlyPrice: propertyData.originalNightlyPriceUSD * 100,
      // offeredNightlyPrice: offeredNightlyPriceUSD,
      imageUrls: propertyData.imageUrls.map((urlObject) => urlObject.value),
    };

    // if offer wasnt null then this is an "update offer" form
    // so update the current property and offer...
    if (offer) {
      const newOffer = {
        id: offer.id,
        requestId: request.id,
        propertyId: offer.property.id,
        totalPrice,
      };

      await Promise.all([
        updatePropertiesMutation.mutateAsync({
          ...newProperty,
          id: offer.property.id,
        }),
        updateOffersMutation.mutateAsync(newOffer).catch(() => errorToast()),
      ]);
      // ...otherwise its a "create offer" form so make a new property and offer
    } else {
      const propertyId = await createPropertiesMutation
        .mutateAsync(newProperty)
        .catch(() => errorToast());

      if (!propertyId) {
        throw new Error("Could not create property, please try again");
      }

      const newOffer = { requestId: request.id, propertyId, totalPrice };

      await createOffersMutation
        .mutateAsync(newOffer)
        .catch(() => errorToast());
    }

    await Promise.all([
      utils.properties.invalidate(),
      utils.offers.invalidate(),
      utils.requests.invalidate(),
    ]);

    afterSubmit?.();

    successfulAdminOfferToast({
      propertyName: newProperty.name,
      totalPrice,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      isUpdate: !!offer,
    });
  }

  const defaultNightlyPrice = 0;
  const [isAirbnb, setIsAirbnb] = useState<boolean>(true);
  const [nightlyPrice, setNightlyPrice] = useState(
    offer ? offeredNightlyPriceUSD : defaultNightlyPrice,
  );

  const totalPrice = nightlyPrice * numberOfNights;

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
            <FormItem className="col-span-full">
              <FormLabel>Property name</FormLabel>
              <FormControl>
                <Input {...field} autoFocus />
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
          name="offeredNightlyPriceUSD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offered price (nightly)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e); // or your existing logic
                    setNightlyPrice(Number(e.target.value));
                  }}
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
          render={() => (
            <FormItem>
              <FormLabel>
                Total offered price ({plural(numberOfNights, "night")})
              </FormLabel>
              <FormControl>
                <Input prefix="$" value={totalPrice} readOnly />
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

        <div className="col-span-full flex flex-row items-center justify-between">
          <div>
            <h1 className="text-sm text-muted-foreground">Listing Type </h1>
            <p>{isAirbnb ? "Airbnb" : "Direct"}</p>
          </div>
          <Switch
            checked={isAirbnb}
            onCheckedChange={() => setIsAirbnb(!isAirbnb)}
          />
        </div>

        {isAirbnb && (
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
        )}

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="col-span-full space-y-1">
          <FormLabel>Image URLs</FormLabel>
          <div className="space-y-2 rounded-md border bg-secondary p-2">
            {imageUrlInputs.fields.map((field, i) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`imageUrls.${i}.value`} // Update this line
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        inputMode="url"
                        placeholder={`Image URL ${i + 1} (${
                          i === 0
                            ? "primary image"
                            : i < 5
                              ? "required"
                              : "optional"
                        })`}
                        onKeyDown={(e) => {
                          const n = imageUrlInputs.fields.length;

                          switch (e.key) {
                            case "Enter":
                              imageUrlInputs.insert(i + 1, {
                                value: "",
                              });
                              e.preventDefault();
                              break;
                            case "ArrowDown":
                              form.setFocus(`imageUrls.${(i + 1) % n}.value`);
                              break;
                            case "ArrowUp":
                              form.setFocus(
                                `imageUrls.${(i + n - 1) % n}.value`,
                              );
                              break;
                            case "Backspace":
                              if (n > 3 && e.currentTarget.value === "") {
                                imageUrlInputs.remove(i);
                                form.setFocus(
                                  `imageUrls.${i === n - 1 ? i - 1 : i}.value`,
                                );
                              }
                              break;
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="emptyInput"
              className="w-full"
              onClick={() => imageUrlInputs.append({ value: "" })}
            >
              Add another image (optional)
            </Button>
          </div>
        </FormItem>

        <Button
          disabled={form.formState.isSubmitting}
          size="lg"
          type="submit"
          className="col-span-full"
        >
          {offer ? "Update" : "Make"} offer
        </Button>
      </form>
    </Form>
  );
}
