import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLinkRequestForm } from "@/components/landing-page/SearchBars/useLinkRequestForm";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";
import LinkConfirmation from "@/components/landing-page/SearchBars/LinkConfirmation";
import { api, type RouterOutputs } from "@/utils/api";
import { Link2 } from "lucide-react";

type ExtractURLType = RouterOutputs["misc"]["extractBookingDetails"];

export default function AddAirbnbLink() {
  const [curTab, setCurTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupIds, setMadeByGroupIds] = useState<number[]>([]);
  const [link, setLink] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerExtract, setTriggerExtract] = useState(false);
  const [openLinkConfirmationDialog, setOpenLinkConfirmationDialog] =
    useState(false);
  const [extractedLinkDataState, setExtractedLinkDataState] = useState<
    ExtractURLType | undefined
  >(null);

  const { form, onSubmit } = useLinkRequestForm({
    setCurTab,
    afterSubmit,
    handleSetOpen,
    handleShowConfetti,
  });

  const handleAddLinkClick = () => setLink(true);
  const handleCancelClick = () => setLink(false);
  const handleExtractClick = () => setTriggerExtract(true);

  useEffect(() => {
    if (triggerExtract) {
      extractData();
    }
  }, [triggerExtract]);

  const extractData = async () => {
    try {
      const extractedData = await api.misc.extractBookingDetails.fetch(
        form.watch("data.airbnbLink"),
      );
      setExtractedLinkDataState(extractedData);
      form.setValue("data.numGuests", extractedData.numOfGuests);
      form.setValue("data.date", {
        from: new Date(extractedData.checkIn),
        to: new Date(extractedData.checkOut),
      });
      setOpenLinkConfirmationDialog(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error extracting booking details.",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setTriggerExtract(false);
    }
  };

  const handleInvite = async () => {
    if (madeByGroupIds.length === 0) {
      toast({ title: "Group IDs not available" });
      return;
    }

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

  const afterSubmit = (madeByGroupIds?: number[]) => {
    if (madeByGroupIds) {
      setMadeByGroupIds(madeByGroupIds);
      setIsLoading(false);
      setOpen(true);
    }
  };

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
    <Form {...form}>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4">
        <FormField
          control={form.control}
          name={`data.${curTab}.airbnbLink`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Paste property link here"
                  className="w-full"
                  icon={Link2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          onClick={onSubmit}
          className="bg-[#004236] text-white"
        >
          Submit
        </Button>
      </div>
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
  );
}
