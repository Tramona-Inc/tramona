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
import { useCityRequestForm } from "./useCityRequestForm";

export function MobileRequestDealTab({
  closeSheet,
}: {
  closeSheet?: () => void;
}) {
  const { form, onSubmit } = useCityRequestForm({
    afterSubmit: closeSheet,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="grid gap-1">
            <PlacesInput
              control={form.control}
              name={`location`}
              formLabel="Location"
              variant="lpMobile"
              placeholder="Select a location"
              icon={MapPinIcon}
            />
            <FormField
              control={form.control}
              name={`date`}
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
              name={`numGuests`}
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
              name={`maxNightlyPriceUSD`}
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
          </div>
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
