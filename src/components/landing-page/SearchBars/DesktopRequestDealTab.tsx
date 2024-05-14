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

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const { form, onSubmit } = useCityRequestForm({ setCurTab });
  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-between gap-y-4"
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
        <div className="my-3 items-center text-xs text-muted-foreground">
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

        <div className="flex gap-2">
          <PlacesInput
            control={form.control}
            name={`data.${curTab}.location`}
            formLabel="Location"
            variant="lpDesktop"
            placeholder="Select a location"
            className="grow-[3] basis-40"
            icon={MapPinIcon}
          />
          <FormField
            control={form.control}
            name={`data.${curTab}.date`}
            render={({ field }) => (
              <FormItem className="grow basis-32">
                <FormControl>
                  <DateRangeInput
                    {...field}
                    label="Check in/out"
                    icon={Users2Icon}
                    variant="lpDesktop"
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
              <FormItem className="grow basis-32">
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
            name={`data.${curTab}.maxNightlyPriceUSD`}
            render={({ field }) => (
              <FormItem className="grow basis-40">
                <FormControl>
                  <Input
                    {...field}
                    label="Maximum price"
                    placeholder="Price per night"
                    icon={DollarSignIcon}
                    variant="lpDesktop"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            className="h-16 bg-teal-900 hover:bg-teal-950"
          >
            Submit request
          </Button>
        </div>
      </form>
    </Form>
  );
}
