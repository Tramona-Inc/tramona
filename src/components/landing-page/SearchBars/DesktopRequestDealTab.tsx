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
  Link2,
  MapPinIcon,
  Plus,
  Users2Icon,
} from "lucide-react";
import { useCityRequestForm } from "./useCityRequestForm";
import { useLinkRequestForm } from "./useLinkRequestForm";
import { CityRequestFiltersDialog } from "./CityRequestFiltersDialog";
import { toast } from "@/components/ui/use-toast";
import { api, RouterOutputs } from "@/utils/api";

import { Separator } from "@/components/ui/separator";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";
import LinkConfirmation from "./LinkConfirmation";

export type ScrapedProperty = {
  nightlyPrice: number;
  propertyName: string;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  cityName: string;
};

type ExtractURLType = RouterOutputs["misc"]["extractBookingDetails"];

export function DesktopRequestDealTab() {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupIds, setMadeByGroupIds] = useState<number[]>([]);
  const [link, setLink] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [triggerExtract, setTriggerExtract] = useState(false);
  const [openLinkConfirmationDialog, setOpenLinkConfirmationDialog] =
    useState(false);
  const [extractedLinkDataState, setExtractedLinkDataState] = useState<
    ExtractURLType | undefined
  >();
  const [airbnbLink, setAirbnbLink] = useState<string | null>(null);
  const handleSetOpen = (val: boolean) => {
    setOpen(val);
  };
  const handleShowConfetti = (val: boolean) => {
    setShowConfetti(val);
  };

  const cityForm = useCityRequestForm({
    setCurTab,
    afterSubmit,
    handleSetOpen,
    handleShowConfetti,
  });
  const linkForm = useLinkRequestForm({
    setCurTab,
    afterSubmit,
    handleSetOpen,
    handleShowConfetti,
  });

  const { form, onSubmit } = link ? linkForm : cityForm;

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
    setLink(true);
  };

  const handleCancelClick = () => {
    setLink(false);
    form.setValue(`data.${curTab}.airbnbLink`, "");
  };

  const handleExtractClick = () => {
    setTriggerExtract(true);
    console.log(extractedLinkDataState);
    setOpenLinkConfirmationDialog(true);
  };

  const allFormValues = form.watch();

  useEffect(() => {
    setAirbnbLink(allFormValues.data[curTab]!.airbnbLink!);
  }, [allFormValues, curTab]);

  const {
    data: extractUrlData,
    refetch: extractURLRefetch,
    isLoading: extractURLIsLoading,
  } = api.misc.extractBookingDetails.useQuery(airbnbLink!, {
    enabled: false,
    onSuccess: (data) => {
      form.setValue(`data.${curTab}.numGuests`, data.numOfGuests);
      form.setValue(`data.${curTab}.date`, {
        from: new Date(data.checkIn),
        to: new Date(data.checkOut),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error extracting booking details.",
        description: error.message || "An error occurred please try again.",
      });
    },
  });

  useEffect(() => {
    if (triggerExtract) {
      extractURLRefetch().catch(() => {
        toast({
          variant: "destructive",
          title:
            "We couldn't extract the booking details. Please check the link.",
        });
      });
      setTriggerExtract(false);
      setExtractedLinkDataState(extractUrlData);
    }
  }, [triggerExtract, extractURLRefetch]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between gap-y-4"
          key={curTab} // rerender on tab changes
        >
          <div
            className={
              link ? "pointer-events-none placeholder-black opacity-50" : ""
            }
          >
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
                      onChange={(value) => field.onChange(value)}
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
                      onChange={(e) => field.onChange(e)}
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
                      onChange={(e) => field.onChange(e)}
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
                            onChange={(e) => field.onChange(e)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  variant="greenPrimary"
                  type="button"
                  onClick={handleExtractClick}
                  className="font-bold"
                >
                  Extract
                </Button>
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
              {!form.formState.isSubmitting
                ? "Submit Request"
                : "Submitting..."}
            </Button>
          </div>
        </form>

        {openLinkConfirmationDialog && (
          <LinkConfirmation
            open={openLinkConfirmationDialog}
            setOpen={setOpenLinkConfirmationDialog}
            extractedLinkDataState={extractedLinkDataState}
            extractIsLoading={extractURLIsLoading}
            formControl={form.control}
            formFields={{
              checkIn: `data.${curTab}.date.from`,
              checkOut: `data.${curTab}.date.to`,
              numGuests: `data.${curTab}.numGuests`,
            }}
            onSubmit={onSubmit} // Pass the form's submit handler
          />
        )}

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
