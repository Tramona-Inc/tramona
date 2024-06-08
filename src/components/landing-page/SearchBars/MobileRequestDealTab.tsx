import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PlacesInput from "@/components/_common/PlacesInput";
import { DollarSignIcon, MapPinIcon, Users2Icon } from "lucide-react";
import DateRangeInput from "@/components/_common/DateRangeInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCityRequestForm } from "./useCityRequestForm";
import { Total } from "../search/MobilePropertyFilter";

export function MobileRequestDealTab({
  closeSheet,
}: {
  closeSheet?: () => void;
}) {
  const [curTab, setCurTab] = useState(0);
  const { form, onSubmit } = useCityRequestForm({
    setCurTab,
    afterSubmit: closeSheet,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
        {/* <RequestTabsSwitcher
          curTab={curTab}
          setCurTab={setCurTab}
          form={form}
        /> */}

        <div className="flex flex-col gap-4">
          <div className="grid gap-1">
            <PlacesInput
              control={form.control}
              name={`data.${curTab}.location`}
              formLabel="Location"
              variant="lpMobile"
              placeholder="Select a location"
              icon={MapPinIcon}
            />
            <FormField
              control={form.control}
              name={`data.${curTab}.date`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DateRangeInput
                      {...field}
                      label="Check in/out"
                      icon={Users2Icon}
                      variant="lpMobile"
                      disablePast
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`data.${curTab}.numGuests`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Guests"
                      placeholder="Add guests"
                      icon={Users2Icon}
                      variant="lpMobile"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`data.${curTab}.maxNightlyPriceUSD`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Maximum nightly price"
                      suffix="/night"
                      placeholder="Price per night"
                      icon={DollarSignIcon}
                      variant="lpMobile"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name={`data.${curTab}.minNumBeds`}
                render={({ field }) => (
                  <FormItem className="h-10 rounded-lg border px-1">
                    <FormControl>
                      <Total
                        className="text-xs/[10px] font-bold"
                        name="Beds"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                        size="size-2/5"
                        textSize="text-[11px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`data.${curTab}.minNumBedrooms`}
                render={({ field }) => (
                  <FormItem className="h-10 rounded-lg border px-1">
                    <FormControl>
                      <Total
                        className="text-xs font-bold"
                        name="Bedrooms"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                        size="size-2/5"
                        textSize="text-[11px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`data.${curTab}.minNumBathrooms`}
                render={({ field }) => (
                  <FormItem className="h-10 rounded-lg border px-1">
                    <FormControl>
                      <Total
                        className="text-xs font-bold"
                        name="Bathrooms"
                        optional={true}
                        total={field.value ?? 0}
                        setTotal={field.onChange}
                        size="size-2/5"
                        textSize="text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>)} />
          </div>
          {/* <AirbnbLinkPopover /> */}
          {/* <p className="mt-1 text-xs text-muted-foreground">
                Have a property you are eyeing, input the Airbnb link here.
              </p> */}
          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit Request
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
