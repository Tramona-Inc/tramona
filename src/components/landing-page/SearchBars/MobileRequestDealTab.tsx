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
import { RequestTabsSwitcher } from "./RequestTabsSwitcher";

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
        <div className="text-xs text-muted-foreground">
          Instead of just seeing listed prices, requesting a deal lets you set
          your budget, and we&apos;ll match you with hosts who have properties
          in the city and accept your price. This way, you can find the perfect
          place to stay within your means!
        </div>

        <RequestTabsSwitcher
          curTab={curTab}
          setCurTab={setCurTab}
          form={form}
        />

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
                      label="Maximum price"
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
