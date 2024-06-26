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
import { ALL_PROPERTY_TYPES, type Request } from "@/server/db/schema";
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
import { type OfferWithProperty } from "../requests/[id]/OfferCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { SelectIcon } from "@radix-ui/react-select";

import { ALL_PROPERTY_AMENITIES } from "@/server/db/schema/tables/propertyAmenities";
import { getS3ImgUrl } from "@/utils/formatters";
import { getNumNights } from "@/utils/utils";
import axios from "axios";
import ErrorMsg from "../ui/ErrorMsg";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

// custom Zod validator for time
const zodTime = z.string().regex(timeRegex, {
  message: "Invalid time format. Time must be in HH:MM format.",
});

const formSchema = z.object({
  propertyName: zodString(),
  offeredPriceUSD: optional(zodNumber({ min: 1 })),
  hostName: zodString(),
  address: zodString({ maxLen: 1000 }),
  areaDescription: optional(zodString({ maxLen: Infinity })),
  maxNumGuests: zodInteger({ min: 1 }),
  numBeds: zodInteger({ min: 1 }),
  numBedrooms: zodInteger({ min: 1 }),
  numBathrooms: zodInteger({ min: 1 }),
  propertyType: z.enum(ALL_PROPERTY_TYPES),
  originalNightlyPriceUSD: zodNumber(),
  offeredNightlyPriceUSD: zodNumber({ min: 1 }),
  avgRating: zodNumber({ min: 0, max: 5 }),
  numRatings: zodInteger({ min: 1 }),
  amenities: z.string().array(),
  about: zodString({ maxLen: Infinity }),
  airbnbUrl: optional(zodUrl()),
  airbnbMessageUrl: optional(zodUrl()),
  tramonaFee: zodNumber({ min: 0 }),
  checkInInfo: optional(zodString()),
  checkInTime: optional(zodTime),
  checkOutTime: optional(zodTime),
  cancellationPolicy: optional(zodString()),
  imageUrls: z.object({ value: zodUrl() }).array(),
  // mapScreenshot: optional(zodString()),
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
      ...(offer
        ? {
            // im sorry
            // ?? undefineds are to turn string | null into string | undefined
            hostName: offer.property.hostName ?? undefined,
            address: offer.property.address,
            areaDescription: offer.property.areaDescription ?? undefined,
            mapScreenshot: offer.property.mapScreenshot ?? undefined,
            maxNumGuests: offer.property.maxNumGuests,
            numBeds: offer.property.numBeds,
            numBedrooms: offer.property.numBedrooms,
            numBathrooms: offer.property.numBathrooms ?? undefined,
            propertyType: offer.property.propertyType,
            avgRating: offer.property.avgRating,
            numRatings: offer.property.numRatings,
            amenities: offer.property.amenities,
            about: offer.property.about,
            airbnbUrl: offer.property.airbnbUrl ?? undefined,
            airbnbMessageUrl: offer.property.airbnbMessageUrl ?? undefined,
            propertyName: offer.property.name,
            offeredPriceUSD: offer.totalPrice / 100,
            offeredNightlyPriceUSD: offeredNightlyPriceUSD,
            tramonaFee: offer.tramonaFee,
            originalNightlyPriceUSD: offer.property.originalNightlyPrice
              ? offer.property.originalNightlyPrice / 100
              : 0,
            checkInInfo: offer.property.checkInInfo ?? undefined,
            checkInTime: offer.property.checkInTime ?? undefined,
            checkOutTime: offer.property.checkOutTime ?? undefined,
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
  const uploadFileMutation = api.files.upload.useMutation();
  const twilioMutation = api.twilio.sendSMS.useMutation();
  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();
  // const getOwnerMutation = api.groups.getGroupOwner.useMutation();
  const getMembersMutation = api.groups.getGroupMembers.useMutation();

  async function onSubmit(data: FormSchema) {
    let url: string | null = null;

    if (file) {
      const fileName = file.name;

      try {
        const uploadUrlResponse = await uploadFileMutation.mutateAsync({
          fileName,
        });
        await axios.put(uploadUrlResponse, file);
        url = getS3ImgUrl(fileName);
      } catch (error) {
        throw new Error("error uploading file");
      }
    }

    const { offeredNightlyPriceUSD: _, ...propertyData } = data;

    // const totalPrice = offeredPriceUSD * 100;
    const totalPrice = Math.round(
      data.offeredNightlyPriceUSD * numberOfNights * 100,
    );

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
      mapScreenshot: url,
    };

    // if offer wasnt null then this is an "update offer" form
    // so update the current property and offer...
    if (offer) {
      const newOffer = {
        id: offer.id,
        requestId: request.id,
        propertyId: offer.property.id,
        totalPrice,
        tramonaFee: data.tramonaFee * 100,
      };

      await Promise.all([
        updatePropertiesMutation.mutateAsync({
          ...newProperty,
          id: offer.property.id,
          isPrivate: true,
        }),
        updateOffersMutation.mutateAsync(newOffer).catch(() => errorToast()),
      ]);
      // ...otherwise its a "create offer" form so make a new property and offer
    } else {
      const propertyId = await createPropertiesMutation
        .mutateAsync({ ...newProperty, isPrivate: true })
        .catch(() => errorToast());

      if (!propertyId) {
        form.setError("root", {
          message: "Could not create property, please try again",
        });
        return;
      }

      const newOffer = {
        requestId: request.id,
        propertyId,
        totalPrice,
        tramonaFee: data.tramonaFee * 100,
        checkIn: request.checkIn,
        checkOut: request.checkOut,
        groupId: request.madeByGroupId,
      };

      await createOffersMutation
        .mutateAsync(newOffer)
        .catch(() => errorToast());
    }

    //const traveler = await getOwnerMutation.mutateAsync(request.madeByGroupId);
    const travelers = await getMembersMutation.mutateAsync(
      request.madeByGroupId,
    );

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
            msg: `Tramona: You have a new match for a request in your Tramona account!\nTramona price: $${data.offeredNightlyPriceUSD}, Airbnb price: $${data.originalNightlyPriceUSD}.\n\nCheck it out now!`
          });

          await twilioMutation.mutateAsync({
            to: traveler.phoneNumber,
            msg: `https://www.tramona.com/requests/${request.id}`,
          });
        }
      }
    }

    successfulAdminOfferToast({
      propertyName: newProperty.name,
      totalPrice,
      checkIn: request.checkIn,
      checkOut: request.checkOut,
      isUpdate: !!offer,
    });

    afterSubmit?.();
  }

  const defaultNightlyPrice = 0;
  const [isAirbnb, setIsAirbnb] = useState<boolean>(true);
  const [nightlyPrice, setNightlyPrice] = useState(
    offer ? offeredNightlyPriceUSD : defaultNightlyPrice,
  );

  const totalPrice = nightlyPrice * numberOfNights;
  const [file, setFile] = useState<File | null>(null);

  return (
    <Form {...form}>
      <ErrorMsg>{form.formState.errors.root?.message}</ErrorMsg>
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
          name="tramonaFee"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tramona Fee</FormLabel>
              <FormControl>
                <Input {...field} inputMode="decimal" prefix="$" />
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
          <>
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

            <FormField
              control={form.control}
              name="airbnbMessageUrl"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Airbnb Message Host Url</FormLabel>
                  <FormControl>
                    <Input {...field} inputMode="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
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

        {/* <FormField
          control={form.control}
          name="mapScreenshot"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Screenshot of Map (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    setFile(selectedFile ?? null);
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
