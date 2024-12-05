import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CANCELLATION_POLICIES,
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
import { useState } from "react";
import { useFieldArray } from "react-hook-form";

import { z } from "zod";
import { type OfferWithProperty } from "../requests/[id]/OfferCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SelectIcon } from "@radix-ui/react-select";
import { getNumNights } from "@/utils/utils";
import ErrorMsg from "../ui/ErrorMsg";
import { parseListingUrl, zodListingUrl } from "@/utils/listing-sites";
import { useZodForm } from "@/utils/useZodForm";
import {
  stringifyRoomsWithBeds,
  zodRoomsWithBedsParser,
} from "@/utils/zodRoomsWithBeds";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

// custom Zod validator for time
const zodTime = z.string().regex(timeRegex, {
  message: "Invalid time format. Time must be in HH:MM format.",
});

const formSchema = z.object({
  propertyName: zodString(),
  offeredPriceUSD: optional(zodNumber({ min: 1 })),
  hostName: zodString(),
  hostProfilePic: zodUrl(),
  address: zodString({ maxLen: 1000 }),
  country: zodString({ maxLen: 1000 }),
  areaDescription: optional(zodString({ maxLen: Infinity })),
  maxNumGuests: zodInteger({ min: 1 }),
  numBeds: zodInteger({ min: 1 }),
  numBedrooms: zodInteger({ min: 1 }),
  numBathrooms: zodInteger({ min: 1 }),
  roomsWithBeds: zodString(),
  propertyType: z.enum(ALL_PROPERTY_TYPES),
  checkInDate: optional(zodString()),
  checkOutDate: optional(zodString()),
  originalNightlyPriceUSD: zodNumber(),
  offeredNightlyPriceUSD: zodNumber({ min: 1 }),
  avgRating: zodNumber({ min: 0, max: 5 }),
  numRatings: zodInteger({ min: 1 }),
  amenities: z.string().transform((s) => s.split("\n").map((s) => s.trim())),
  about: zodString({ maxLen: Infinity }),
  originalListingUrl: optional(zodListingUrl),
  checkInInfo: zodString(),
  checkInTime: optional(zodTime),
  checkOutTime: optional(zodTime),
  cancellationPolicy: z.enum(CANCELLATION_POLICIES),
  imageUrls: z.object({ value: zodUrl() }).array(),
  reviews: z
    .object({
      profilePic: zodUrl().optional(),
      name: zodString(),
      review: zodString({ maxLen: Infinity }),
      rating: zodInteger({ min: 1, max: 5 }),
    })
    .array(),
});

export default function AdminOfferForm({
  afterSubmit,
  request,
  // pass it the current offer data to turn it from a "create offer" form
  // to an autofilled "update offer" form
  offer,
}: {
  afterSubmit?: () => void;
  offer?: OfferWithProperty;
  request?: Request;
}) {
  let numberOfNights = request
    ? getNumNights(request.checkIn, request.checkOut)
    : 1;
  const offeredNightlyPriceUSD = offer
    ? Math.round(offer.totalPrice / numberOfNights / 100)
    : 1;

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      imageUrls: [
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
        { value: "" },
      ],
      reviews: [{ profilePic: "", name: "", review: "", rating: 0 }],
      ...(offer
        ? {
            // im sorry
            // ?? undefineds are to turn string | null into string | undefined
            hostName: offer.property.hostName ?? undefined,
            hostProfilePic: offer.property.hostProfilePic ?? undefined,
            address: offer.property.address,
            country: offer.property.country,
            areaDescription: offer.property.areaDescription ?? undefined,
            maxNumGuests: offer.property.maxNumGuests,
            numBeds: offer.property.numBeds,
            numBedrooms: offer.property.numBedrooms,
            numBathrooms: offer.property.numBathrooms ?? undefined,
            propertyType: offer.property.propertyType,
            avgRating: offer.property.avgRating,
            numRatings: offer.property.numRatings,
            amenities: offer.property.amenities.join("\n"),
            about: offer.property.about,
            airbnbUrl: offer.property.airbnbUrl ?? undefined,
            propertyName: offer.property.name,
            offeredPriceUSD: offer.totalPrice / 100,
            offeredNightlyPriceUSD: offeredNightlyPriceUSD,
            originalNightlyPriceUSD: offer.property.originalNightlyPrice
              ? offer.property.originalNightlyPrice / 100
              : 0,
            checkInInfo: offer.property.additionalCheckInInfo!,
            checkInTime: offer.property.checkInTime,
            checkOutTime: offer.property.checkOutTime,
            imageUrls: offer.property.imageUrls.map((url) => ({ value: url })),
            reviews: [],
            roomsWithBeds: offer.property.roomsWithBeds
              ? stringifyRoomsWithBeds(offer.property.roomsWithBeds)
              : undefined,
          }
        : {}),
    },
  });

  const { checkInDate, checkOutDate } = form.watch();

  !request && (numberOfNights = getNumNights(checkInDate!, checkOutDate!));

  const imageUrlInputs = useFieldArray({
    name: "imageUrls",
    control: form.control,
  });

  const reviewInputs = useFieldArray({
    name: "reviews",
    control: form.control,
  });

  const updatePropertyMutation = api.properties.update.useMutation();
  const updateOfferMutation = api.offers.update.useMutation();
  const createPropertyMutation = api.properties.create.useMutation();
  const createOfferMutation = api.offers.create.useMutation();
  const createReviewsMutation = api.reviews.create.useMutation();
  const twilioMutation = api.twilio.sendSMS.useMutation();
  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();
  // const getOwnerMutation = api.groups.getGroupOwner.useMutation();
  const getMembersMutation = api.groups.getGroupMembers.useMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    const res = zodRoomsWithBedsParser.safeParse(data.roomsWithBeds);
    if (!res.success) {
      form.setError("roomsWithBeds", {
        message: res.error.issues[0]!.message,
      });
      return;
    }

    const roomsWithBeds = res.data;

    const { offeredNightlyPriceUSD: _, ...propertyData } = data;

    // const totalPrice = offeredPriceUSD * 100;
    const totalPrice = Math.round(
      data.offeredNightlyPriceUSD * numberOfNights * 100,
    );

    const originalListing =
      propertyData.originalListingUrl !== undefined
        ? parseListingUrl(propertyData.originalListingUrl)
        : undefined;

    const newProperty = {
      ...propertyData,
      name: propertyData.propertyName,
      propertyType: propertyData.propertyType,
      originalNightlyPrice: Math.round(
        propertyData.originalNightlyPriceUSD * 100,
      ),
      numBathrooms: 1,
      // offeredNightlyPrice: offeredNightlyPriceUSD,
      imageUrls: propertyData.imageUrls.map((urlObject) => urlObject.value),

      originalListingPlatform: originalListing?.Site.siteName,
      originalListingId: originalListing?.listingId,
      roomsWithBeds,
    };

    // if offer wasnt null then this is an "update offer" form
    // so update the current property and offer...
    if (offer) {
      const newOffer = {
        id: offer.id,
        requestId: request ? request.id : offer.request?.id,
        propertyId: offer.property.id,
        totalPrice,
      };
      ``;

      await createReviewsMutation.mutateAsync({
        reviews: propertyData.reviews,
        propertyId: offer.property.id,
      });

      await Promise.all([
        updatePropertyMutation.mutateAsync({
          ...newProperty,
          id: offer.property.id,
          isPrivate: true,
        }),
        updateOfferMutation.mutateAsync(newOffer).catch(() => errorToast()),
      ]);
      // ...otherwise its a "create offer" form so make a new property and offer
    } else {
      const propertyId = await createPropertyMutation
        .mutateAsync({ ...newProperty, isPrivate: true })
        .catch(() => errorToast());

      if (!propertyId) {
        form.setError("root", {
          message: "Could not create property, please try again",
        });
        return;
      }

      const newOffer = {
        requestId: request?.id,
        propertyId,
        totalPrice,
        hostPayout: 0,
        travelerOfferedPriceBeforeFees: totalPrice,
        checkIn: request ? request.checkIn : new Date(checkInDate!),
        checkOut: request ? request.checkOut : new Date(checkOutDate!),
        // groupId: request?.madeByGroupId,
      };

      await createReviewsMutation.mutateAsync({
        reviews: propertyData.reviews,
        propertyId,
      });

      await createOfferMutation.mutateAsync(newOffer).catch(() => errorToast());
    }

    //const traveler = await getOwnerMutation.mutateAsync(request.madeByGroupId);
    const travelers = request
      ? await getMembersMutation.mutateAsync(request.madeByGroupId)
      : [];

    for (const traveler of travelers) {
      if (traveler.phoneNumber) {
        if (traveler.isWhatsApp) {
          await twilioWhatsAppMutation.mutateAsync({
            templateId: "HXfeb90955f0801d551e95a6170a5cc015",
            to: traveler.phoneNumber,
          });
        } else {
          await twilioMutation.mutateAsync({
            to: traveler.phoneNumber,
            msg: `Tramona: You have a new match for a request in your Tramona account!\nTramona price: $${data.offeredNightlyPriceUSD}, Airbnb price: $${data.originalNightlyPriceUSD}.\n\nCheck it out now!`,
          });

          await twilioMutation.mutateAsync({
            to: traveler.phoneNumber,
            msg: `https://www.tramona.com/requests/${request ? request.id : ""}`,
          });
        }
      }
    }

    successfulAdminOfferToast({
      propertyName: newProperty.name,
      totalPrice,
      checkIn: request ? request.checkIn : new Date(checkInDate!),
      checkOut: request ? request.checkOut : new Date(checkOutDate!),
      isUpdate: !!offer,
    });

    afterSubmit?.();
  });

  const defaultNightlyPrice = 0;
  const [nightlyPrice, setNightlyPrice] = useState(
    offer ? offeredNightlyPriceUSD : defaultNightlyPrice,
  );

  const totalPrice = nightlyPrice * numberOfNights;

  return (
    <Form {...form}>
      <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
      {/* {JSON.stringify(form.formState.errors, null, 2)} */}
      {/* {JSON.stringify(form.formState.errors, null, 2)} */}
      <form
        onSubmit={onSubmit}
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
          name="hostProfilePic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Host profile picture</FormLabel>
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

        {!request && (
          <>
            <FormField
              control={form.control}
              name="checkInDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check In Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Check Out Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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
                    <SelectIcon>
                      <CaretSortIcon className="h-4 w-4 opacity-50" />
                    </SelectIcon>
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
          name="numBathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input {...field} inputMode="numeric" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="roomsWithBeds"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Beds in Rooms</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Each line = beds in 1 room, formatted like '1 Queen, 2 Twin'"
                />
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
              <FormLabel>Amenities (put 1 per line)</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-y" rows={10} />
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
          name="originalListingUrl"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Original Listing URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  inputMode="url"
                  placeholder="Leave blank for direct listings"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormDescription>
                Be sure to capitalize the first letter
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkInInfo"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Check In Info (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-y" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkInTime"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Check In Time (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="checkOutTime"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Check Out Time (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="areaDescription"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Area Description (optional)</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cancellationPolicy"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Cancellation Policy (optional)</FormLabel>
              <FormControl>
                <Textarea {...field} className="resize-y" rows={2} />
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

        <FormItem className="col-span-full space-y-1">
          <FormLabel>Reviews</FormLabel>
          <div className="space-y-4">
            {reviewInputs.fields.map((review, index) => (
              <div key={review.id} className="space-y-1">
                <FormField
                  control={form.control}
                  name={`reviews.${index}.profilePic`}
                  render={({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Profile Picture URL" />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`reviews.${index}.name`}
                  render={({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="Name" />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`reviews.${index}.rating`}
                  render={({ field }) => (
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        max="5"
                        placeholder="Rating (1-5)"
                      />
                    </FormControl>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`reviews.${index}.review`}
                  render={({ field }) => (
                    <FormControl>
                      <Textarea {...field} placeholder="Review" />
                    </FormControl>
                  )}
                />
                <Button
                  type="button"
                  variant="emptyInput"
                  onClick={() => reviewInputs.remove(index)}
                >
                  Remove Review
                </Button>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                reviewInputs.append({
                  profilePic: "",
                  name: "",
                  rating: 1,
                  review: "",
                })
              }
            >
              Add Another Review
            </Button>
          </div>
        </FormItem>

        <Button size="lg" type="submit" className="col-span-full">
          {offer ? "Update" : "Make"} offer
        </Button>
      </form>
    </Form>
  );
}
