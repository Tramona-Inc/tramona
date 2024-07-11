import React, { useState, useEffect } from "react";
import DateRangeInput from "@/components/_common/DateRangeInput";
import PlacesInput from "@/components/_common/PlacesInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  DollarSignIcon,
  FilterIcon,
  HomeIcon,
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import { useCityRequestForm } from "./useCityRequestForm";
import { CityRequestFiltersDialog } from "./CityRequestFiltersDialog";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";

import { Separator } from "@/components/ui/separator";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";
import LoadingPropertyScrape from "./DesktopRequestComponents/LoadingPropertyScrape";

export type ScrapedProperty = {
  nightlyPrice: number;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  cityName: string;
};

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupIds, setMadeByGroupIds] = useState<number[]>([]);
  const [link, setLink] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedPropertyData, setScrapedPropertyData] = useState<
    ScrapedProperty | undefined
  >();
  const [propertyName, setPropertyName] = useState<string | undefined>();
  const [triggerScrape, setTriggerScrape] = useState(false);
  const [scrapeLoading, setScrapeLoading] = useState(false);

  const { form, onSubmit } = useCityRequestForm({ setCurTab, afterSubmit });

  const inviteLinkQuery = api.groups.generateInviteLink.useQuery(
    { groupId: groupId! },
    { enabled: groupId !== null },
  );

  useEffect(() => {
    if (inviteLinkQuery.data) {
      setInviteLink(inviteLinkQuery.data.link);
    }
  }, [inviteLinkQuery.data]);

  function afterSubmit(madeByGroupIds?: number[]) {
    if (madeByGroupIds !== undefined) {
      setMadeByGroupIds(madeByGroupIds);
      setGroupId(madeByGroupIds[0] ?? null);
    }
    setOpen(true);
    setShowConfetti(true);
  }

  const inviteUserByEmail = api.groups.inviteUserByEmail.useMutation();

  const handleInvite = async () => {
    if (madeByGroupIds.length === 0) {
      toast({ title: "Group IDs not available" });
      return;
    }

    setIsLoading(true);
    // try {
    //   for (const email of emails) {
    //     for (const groupId of madeByGroupIds) {
    //       if (email.length > 0) {
    //         await inviteUserByEmail.mutateAsync({ email, groupId });
    //       }
    //     }
    //   }
    //   toast({ title: "Invites sent successfully!" });
    // } catch (error) {
    //   toast({ title: "Error sending invites" });
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleAddLinkClick = () => {
    setLink(!link);
  };

  const handleCancelClick = () => {
    setLink(!link);
    form.setValue(`data.${curTab}.airbnbLink`, "");
  };

  const handleScrapeClick = () => {
    setScrapeLoading(true);
    setTriggerScrape(true);
  };

  // link scrape logic
  const airbnbLink = form.getValues(`data.${curTab}.airbnbLink`);
  const { data: scrapedProperty, refetch: refetchScrape } =
    api.misc.scrapeUsingLink.useQuery(
      { url: airbnbLink! },
      {
        enabled: false,
        onSuccess: () => {
          setScrapeLoading(false);
          setTriggerScrape(false);
        },
        onError: (error) => {
          setScrapeLoading(false);
          setTriggerScrape(false);
          toast({
            variant: "destructive",
            title: "Be sure it is a valid Airbnb property link.",
            description: error.message || "An error occurred please try again.",
          });
        },
      },
    );

  // Update form values when scraped property data is available
  useEffect(() => {
    if (scrapedProperty && !(scrapedProperty instanceof TRPCError)) {
      const roundedNightlyPrice =
        Math.round(scrapedProperty.nightlyPrice * 100) / 100;
      form.setValue(`data.${curTab}.maxNightlyPriceUSD`, roundedNightlyPrice);
      form.setValue(`data.${curTab}.location`, scrapedProperty.cityName);
      form.setValue(`data.${curTab}.numGuests`, scrapedProperty.numGuests);
      form.setValue(`data.${curTab}.date`, {
        from: scrapedProperty.checkIn,
        to: scrapedProperty.checkOut,
      });
      setPropertyName(scrapedProperty.propertyName);
      setScrapedPropertyData(scrapedProperty);
      console.log(scrapedPropertyData);
    }
  }, [scrapedProperty, scrapedPropertyData, curTab, form]);

  useEffect(() => {
    if (triggerScrape) {
      refetchScrape().catch(() => {
        toast({
          variant: "destructive",
          title: "We couldn't find that property. Please try another property.",
        });
      });
    }
  }, [triggerScrape, refetchScrape]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between gap-y-4"
          key={curTab} // rerender on tab changes
        >
          {scrapeLoading ? (
            <LoadingPropertyScrape />
          ) : (
            <div
              className={
                link ? "pointer-events-none placeholder-black opacity-50" : ""
              }
            >
              {link && (
                <Input
                  label="Property Name"
                  value={propertyName}
                  placeholder="Property name"
                  icon={HomeIcon}
                  variant="lpDesktop"
                  className="pointer-events-none my-1 bg-white text-black"
                />
              )}
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

              <div className="flex items-center gap-2 text-teal-900">
                <CityRequestFiltersDialog form={form} curTab={curTab}>
                  <Button
                    variant="ghost"
                    type="button"
                    className="px-2 text-teal-900 hover:bg-teal-900/15"
                  >
                    <FilterIcon />
                    More filters
                  </Button>
                </CityRequestFiltersDialog>
              </div>
            </div>
          )}
          <div className="flex flex-row items-center justify-center gap-x-4 text-zinc-400">
            <Separator className="w-2/5 bg-zinc-400" />
            <p> or </p>
            <Separator className="w-2/5 bg-zinc-400" />
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
                onClick={handleAddLinkClick}
              >
                <Plus size={20} />
                Add link
              </Button>
            )}
            {link && (
              <div className="flex items-center space-x-2">
                <div className="basis-full">
                  <FormField
                    control={form.control}
                    name={`data.${curTab}.airbnbLink`}
                    render={({ field }) => (
                      <FormItem>
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
                {!scrapeLoading && (
                  <Button
                    variant="greenPrimary"
                    type="button"
                    onClick={handleScrapeClick}
                    className="font-bold"
                  >
                    Add
                  </Button>
                )}
                <Button
                  variant="link"
                  type="button"
                  onClick={handleCancelClick}
                  className="font-bold"
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
        </form>

        <RequestSubmittedDialog
          open={open}
          setOpen={setOpen}
          form={form}
          curTab={curTab}
          showConfetti={showConfetti}
          handleInvite={handleInvite}
          isLoading={isLoading}
          inviteLink={inviteLink}
        />
      </Form>
    </>
  );
}
