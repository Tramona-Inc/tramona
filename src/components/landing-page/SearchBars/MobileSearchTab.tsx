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
import MobilePropertyFilter from "../search/MobilePropertyFilter";

export function MobileSearchTab({ closeSheet }: { closeSheet: () => void }) {
  const { form, onSubmit } = useSearchBarForm({
    afterSubmit: closeSheet,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex  flex-col justify-between">
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
                    label="Maximum nightly price"
                    placeholder="Price per night"
                    suffix="/night"
                    icon={DollarSignIcon}
                    variant="lpMobile"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-start">
            <MobilePropertyFilter />
          </div>
        </div>

        <Separator className="my-4" />
        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={() => form.reset()}>
            Clear all
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
