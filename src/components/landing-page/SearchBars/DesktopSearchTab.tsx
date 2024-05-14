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
import { useSearchBarForm } from "./useSearchBarForm";

export function DesktopSearchTab() {
  const form = useSearchBarForm();

  return (
    <Form {...form}>
      <form className="flex h-16 items-stretch gap-2">
        <PlacesInput
          control={form.control}
          name="location"
          formLabel="Location"
          variant="lpDesktop"
          placeholder="Select a location"
          icon={MapPinIcon}
          className="grow-[3] basis-40"
        />
        <FormField
          control={form.control}
          name="date"
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
          name="numGuests"
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
          name="maxNightlyPriceUSD"
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
          Search
        </Button>
      </form>
    </Form>
  );
}
