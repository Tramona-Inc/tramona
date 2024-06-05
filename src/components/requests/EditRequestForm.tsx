import { Total } from "@/components/landing-page/search/MobilePropertyFilter";
import { getNumNights } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  DollarSignIcon,
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import DateRangeInput from "../_common/DateRangeInput";
import PlacesInput from "../_common/PlacesInput";
import { cityRequestSchema } from "../landing-page/SearchBars/schemas";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { type DetailedRequest, type RequestWithUser } from "./RequestCard";

export default function EditRequestForm({
  request,
}: {
  request: DetailedRequest | RequestWithUser;
}) {
  const formSchema = cityRequestSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: request.location,
      date: { from: request.checkIn, to: request.checkOut },
      numGuests: request.numGuests,
      maxNightlyPriceUSD:
        request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut),
      minNumBedrooms: request.minNumBedrooms ?? 0,
      minNumBeds: request.minNumBeds ?? 0,
      minNumBathrooms: request.minNumBathrooms ?? 0,
      airbnbLink: request.airbnbLink ?? "",
      note: request.note ?? "",
    },
  });

  const [link, setLink] = useState<boolean>(request.airbnbLink ? true : false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between gap-y-4"
        >
          <div className="flex flex-col gap-2">
            <PlacesInput
              control={form.control}
              name={"location"}
              formLabel="Location"
              variant="lpDesktop"
              placeholder="Select a location"
              icon={MapPinIcon}
            />

            <FormField
              control={form.control}
              name={"date"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateRangeInput
                      {...field}
                      label="Check in/out"
                      icon={CalendarIcon}
                      variant="lpDesktop"
                      disablePast
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"numGuests"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Guests"
                      placeholder="Add guests"
                      icon={Users2Icon}
                      variant="lpDesktop"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"maxNightlyPriceUSD"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Maximum price"
                      placeholder="Price per night"
                      suffix="/night"
                      icon={DollarSignIcon}
                      variant="lpDesktop"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <CityRequestFiltersDialog form={form} curTab={curTab}>
              <Button
                variant="ghost"
                type="button"
                className="px-2 text-teal-900 hover:bg-teal-900/15"
              >
                <FilterIcon />
                More filters
              </Button>
            </CityRequestFiltersDialog> */}

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name={"minNumBeds"}
                render={({ field }) => (
                  <FormItem className="rounded-lg border px-2">
                    <FormControl>
                      <Total
                        className="text-sm font-bold"
                        name="Beds"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"minNumBedrooms"}
                render={({ field }) => (
                  <FormItem className="rounded-lg border px-2">
                    <FormControl>
                      <Total
                        className="text-sm font-bold"
                        name="Bedrooms"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"minNumBathrooms"}
                render={({ field }) => (
                  <FormItem className="rounded-lg border px-2">
                    <FormControl>
                      <Total
                        className="text-sm font-bold"
                        name="Bathrooms"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <p className="text-sm">
                Have a property you like? We&apos;ll send your request directly
                to the host.
              </p>
              {!link && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setLink(!link)}
                >
                  <Plus size={20} />
                  Add link
                </Button>
              )}
              {link && (
                <div className="flex">
                  <div className="basis-full">
                    <FormField
                      control={form.control}
                      name={"airbnbLink"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Paste property link here (optional)"
                              className="w-full"
                              icon={Link2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setLink(!link);
                      form.setValue("airbnbLink", "");
                    }}
                    className="font-bold text-teal-900"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            <div className="flex justify-end sm:justify-start">
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="mt-2 h-12 w-full rounded-md bg-teal-900 hover:bg-teal-950 sm:w-auto sm:rounded-full lg:rounded-md"
              >
                Edit Request
              </Button>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"secondary"}>Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="mt-2 h-12 w-full rounded-md bg-teal-900 hover:bg-teal-950 sm:w-auto sm:rounded-full lg:rounded-md"
              >
                Edit Request
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </>
  );
}
