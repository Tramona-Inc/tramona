import DateRangeInput from "@/components/_common/DateRangeInput";
import PlacesInput from "@/components/_common/PlacesInput";
import { Total } from "@/components/landing-page/search/MobilePropertyFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { InputLink } from "./inputLink";
import { Input } from "@/components/ui/input"
import {
  CalendarIcon,
  DollarSignIcon,
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Confetti from "react-confetti";
import { useCityRequestForm } from "./useCityRequestForm";
import { useMediaQuery } from '@/components/_utils/useMediaQuery'

export function DesktopRequestDealTab({
  className,
}: {
  className?: string;
}) {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  function afterSubmit() {
    setOpen(true);
    setShowConfetti(true);
    setTimeout(()=> {
      if(!open) {
        setOpen(false)
      }
    }, 5000)
  }

  const { form, onSubmit } = useCityRequestForm({ setCurTab, afterSubmit });

  const [link, setLink] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between gap-y-4"
          key={curTab} // rerender on tab changes (idk why i have to do this myself)
        >
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
              name={`data.${curTab}.numGuests`}
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
              name={`data.${curTab}.maxNightlyPriceUSD`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      label="Maximum nightly price"
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
            {!isMobile ? 
            <div className="flex flex-cols-2 gap-2">
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
                        textSize="text-[11px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> 
            : 
            <div className="flex gap-2 justify-between flex-col w-auto">
            <FormField
              control={form.control}
              name={`data.${curTab}.minNumBeds`}
              render={({ field }) => (
                <FormItem className="rounded-lg border px-2">
                  <FormControl>
                    <Total
                      className="text-sm font-bold"
                      name="Beds"
                      optional={true}
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                      size="size-3/5"
                      textSize="text-xs"
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
                <FormItem className="h-10 rounded-lg border px-2">
                  <FormControl>
                    <Total
                      className="text-sm font-bold"
                      name="Bedrooms"
                      optional={true}
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                      size="size-3/5"
                      textSize="text-xs"
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
                <FormItem className="h-10 rounded-lg border px-2">
                  <FormControl>
                    <Total
                      className="text-sm font-bold"
                      name="Bathrooms"
                      optional={true}
                      total={field.value ?? 0}
                      setTotal={field.onChange}
                      size="size-3/5"
                      textSize="text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            }
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
            <div className="flex justify-end sm:justify-start">
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="mt-2 h-12 w-full rounded-md bg-teal-900 hover:bg-teal-950 sm:w-auto sm:rounded-full lg:rounded-md"
              >
                Submit Request
              </Button>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <h1 className="mb-4 text-center text-2xl font-bold">
                Congrats on submitting a request!
              </h1>
              <p className="mb-4">
                We have sent it out to every host in{" "}
                <b>{form.getValues(`data.${curTab}.location`)}</b>.
              </p>
              <p className="mb-4">
                In the next 24 hours, hosts will send you properties that match
                your requirements. To check out matches,{" "}
                <Link
                  href="/requests"
                  className="font-semibold text-teal-700 underline"
                >
                  click here
                </Link>
                .
              </p>
              <p className="mb-6">
                In the meantime, check out some other properties we have on
                Tramona and make more requests.
              </p>
              <Button
                asChild
                className="rounded-lg bg-teal-900 px-4 py-2 text-white hover:bg-teal-950"
              >
                Explore more properties
              </Button>

              {showConfetti && (
                <div className="z-100 pointer-events-none fixed inset-0">
                  <Confetti width={window.innerWidth} recycle={false} />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  );
}
