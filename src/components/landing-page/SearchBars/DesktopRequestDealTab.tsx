import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PlacesInput from "@/components/_common/PlacesInput";
import {
  DollarSignIcon,
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import DateRangeInput from "@/components/_common/DateRangeInput";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCityRequestForm } from "./useCityRequestForm";
import { RequestTabsSwitcher } from "./RequestTabsSwitcher";
import { FilterPropertiesBtn } from "./FilterPropertiesBtn";

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const { form, onSubmit } = useCityRequestForm({ setCurTab });
  const [link, setLink] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-between gap-y-4"
        key={curTab} // rerender on tab changes (idk why i have to do this myself)
      >
        {/* <div className="my-3 items-center text-balance text-center text-xs text-muted-foreground">
          Instead of just seeing listed prices, requesting a deal lets you set
          your budget, and we&apos;ll match you with hosts who have properties
          in the city and accept your price. This way, you can find the perfect
          place to stay within your means!
        </div> */}

        {/* <RequestTabsSwitcher
          curTab={curTab}
          setCurTab={setCurTab}
          form={form}
        /> */}

        <div className="flex flex-col gap-2">
          <PlacesInput
            control={form.control}
            name={`data.${curTab}.location`}
            formLabel="Location"
            variant="lpDesktop"
            placeholder="Select a location"
            icon={MapPinIcon}
          />

          <FormField
            control={form.control}
            name={`data.${curTab}.date`}
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <DateRangeInput
                    {...field}
                    label="Check in/out"
                    icon={Users2Icon}
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
            name={`data.${curTab}.numGuests`}
            render={({ field }) => (
              <FormItem className="">
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
              <FormItem className="">
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
          <div className="flex items-center gap-2 text-teal-900">
            <FilterPropertiesBtn />
          </div>

          <div className="space-y-1">
            <p className="text-sm">
              Have a property you like? We&apos;ll send your request directly to
              the host.
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
                    name={`data.${curTab}.airbnbLink`}
                    render={({ field }) => (
                      <FormItem className="">
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
                  onClick={() => {
                    setLink(!link);
                    form.setValue(`data.${curTab}.airbnbLink`, "");
                  }}
                  className="font-bold text-teal-900"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
          <div>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="mt-2 h-12 bg-teal-900 hover:bg-teal-950"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
