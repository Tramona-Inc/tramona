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
import { Plus } from "lucide-react";
import { InputLink } from "./inputLink";

export function MobileRequestDealTab({
  closeSheet,
  className,
}: {
  closeSheet?: () => void;
  className? : string;
}) {
  const [curTab, setCurTab] = useState(0);
  const { form, onSubmit } = useCityRequestForm({
    setCurTab,
    afterSubmit: closeSheet,
  });

  const [link, setLink] = useState(false)

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
          <div className="space-y-1">
              <p className="text-xs">
                Already have a property you like? Tramona will get you the same property, or their next door neighbour
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
                <div className="flex flex-row h-7">
                  {/* <div className="basis-full"> */}
                    <FormField
                      control={form.control}
                      name={`data.${curTab}.airbnbLink`}
                      render={({ field }) => (
                        <FormItem className="basis-full rounded-lg border justify-center items-center">
                          <FormControl>
                            <div className="flex rounded-lg border h-7">
                            <div><p className="h-[25.5px] rounded-s-lg bg-slate-200 px-1">Airbnb.com/</p></div>
                            <InputLink
                              {...field}
                              placeholder="Paste Airbnb link"
                              className={!className ? "md:bg-secondary lg:bg-white" : className}
                            />
                            {/* <input type="text" placeholder="Paste Airbnb link"/> */}
                            </div>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                  {/* </div> */}
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      setLink(!link);
                      form.setValue(`data.${curTab}.airbnbLink`, "");
                    }}
                    className="font-bold text-teal-900 h-7"
                  >
                    Cancel
                  </Button>
                </div>
              )}
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
