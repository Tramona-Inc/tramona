import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PlacesInput from "@/components/_common/PlacesInput";
import { DollarSignIcon, MapPinIcon, Users2Icon } from "lucide-react";
import DateRangeInput from "@/components/_common/DateRangeInput";
import { Button } from "@/components/ui/button";
import { useCityRequestForm } from "./useCityRequestForm";
import { RequestTabsSwitcher } from "./RequestTabsSwitcher";
import Link from "next/link";
import Confetti from "react-confetti";

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  function afterSubmit() {
    setOpen(true);
    setShowConfetti(true);
  }

  const { form, onSubmit } = useCityRequestForm({ setCurTab, afterSubmit });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between gap-y-4"
          key={curTab} // rerender on tab changes (idk why i have to do this myself)
        >
          <div className="my-3 items-center text-balance text-center text-xs text-muted-foreground">
            Instead of just seeing listed prices, requesting a deal lets you set
            your budget, and we&apos;ll match you with hosts who have properties
            in the city and accept your price. This way, you can find the
            perfect place to stay within your means!
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
                      suffix="/night"
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
              disabled={form.formState.isSubmitting}
              className="h-16 bg-teal-900 hover:bg-teal-950"
            >
              Submit Request
            </Button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex flex-col sm:max-w-lg md:max-w-fit md:px-36 md:py-10">
              <h1 className="mb-4 text-center text-2xl font-bold">
                Congrats on submitting a request!
              </h1>
              <p className="mb-4">
                We have sent it out to every host in{" "}
                {form.getValues(`data.${curTab}.location`)}.
              </p>
              <p className="mb-4">
                In the next 24 hours, hosts will send you properties that match
                your requirements. To check out matches{" "}
                <Link
                  href="/requests"
                  className="cursor-pointer font-semibold text-teal-700 underline"
                >
                  click here
                </Link>
                .
              </p>
              <p className="mb-6">
                In the meantime, check out some other properties we have on
                Tramona and make more offers.
              </p>
              <div className="flex justify-center">
                <Button
                  asChild
                  className="cursor-pointer rounded-lg bg-teal-900 px-4 py-2 text-white hover:bg-teal-950"
                >
                  Explore more properties
                </Button>
              </div>

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
