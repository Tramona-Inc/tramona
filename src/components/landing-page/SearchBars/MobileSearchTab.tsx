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
import { Separator } from "@/components/ui/separator";
import { useSearchBarForm } from "./useSearchBarForm";

export function MobileSearchTab() {
  const form = useSearchBarForm();

  return (
    <Form {...form}>
      <form className="flex  flex-col justify-between">
        <div className="flex flex-col gap-2">
          <PlacesInput
            control={form.control}
            name="location"
            formLabel="Location"
            variant="lpMobile"
            placeholder="Select a location"
            icon={MapPinIcon}
          />
          <FormField
            control={form.control}
            name="date"
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
            name="numGuests"
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
            name="maxNightlyPriceUSD"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    label="Maximum price"
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
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            Clear all
          </Button>
          <Button type="submit">Search</Button>
        </div>
      </form>
    </Form>
  );
}
