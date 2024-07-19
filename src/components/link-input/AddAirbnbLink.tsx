import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";
import LinkConfirmation from "@/components/landing-page/SearchBars/LinkConfirmation";
import { api, type RouterOutputs } from "@/utils/api";
import { Link2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ExtractURLType = RouterOutputs["misc"]["extractBookingDetails"];

export default function AddAirbnbLink({
  setIsLinkActive,
  isLinkActive,
  fromRequestDealTab,
}: {
  setIsLinkActive?: (val: boolean) => void;
  isLinkActive: boolean;
  fromRequestDealTab: boolean;
}) {
  const airbnbUrlPattern = "https://www.airbnb.com/";
  const schema = z.object({
    airbnbLink: z.string().refine((val) => val.startsWith(airbnbUrlPattern), {
      message: `Link must start with ${airbnbUrlPattern}`,
    }),
  });
  const form = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      airbnbLink: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupIds, setMadeByGroupIds] = useState<number[]>([]);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [triggerExtract, setTriggerExtract] = useState(false);
  const [openLinkConfirmationDialog, setOpenLinkConfirmationDialog] =
    useState(false);
  const [airbnbLink, setAirbnbLink] = useState<string | null>(null);
  const [extractedLinkDataState, setExtractedLinkDataState] = useState<
    ExtractURLType | undefined
  >(undefined);

  const handleCancelClick = () => {
    if (fromRequestDealTab && setIsLinkActive) {
      setIsLinkActive(false);
    }
    form.reset();
  };
  const handleExtractClick = () => setTriggerExtract((prev) => !prev);

  const {
    data: extractedData,
    refetch: refetchExtractedData,
    isLoading: extractURLIsLoading,
  } = api.misc.extractBookingDetails.useQuery(airbnbLink!, {
    enabled: false,
    onError: (error) => {
      toast({
        title: "Failed to extract booking details",
        description: `Please try again, or another link. Error:  + ${error.message}`,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    void refetchExtractedData();
  }, [airbnbLink]);

  useEffect(() => {
    void refetchExtractedData();
    setExtractedLinkDataState(extractedData);
    console.log("extractedData", extractedData);
    if (extractedLinkDataState) {
      setOpenLinkConfirmationDialog(true);
    }
  }, [triggerExtract]);

  const handleInvite = async () => {
    if (madeByGroupIds.length === 0) {
      toast({ title: "Group IDs not available" });
      return;
    }
  };

  const airbnbLinkValue = form.watch("airbnbLink");

  useEffect(() => {
    setAirbnbLink(airbnbLinkValue);
  }, [airbnbLinkValue]);

  const onSubmit = () => {
    setTriggerExtract(true);
  };

  return (
    <div className="flex flex-row gap-x-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-row justify-between gap-x-2"
        >
          <FormField
            control={form.control}
            name="airbnbLink"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Paste property link here"
                    className=""
                    icon={Link2}
                  />
                </FormControl>
                {form.formState.errors.airbnbLink && (
                  <FormMessage>
                    {form.formState.errors.airbnbLink.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          {fromRequestDealTab ? (
            <div className="flex flex-row gap-x-1">
              <Button
                type="button"
                onClick={handleExtractClick}
                className="text-white"
                variant="greenPrimary"
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={handleCancelClick}
                className=""
                variant="outline"
              >
                Cancel
              </Button>{" "}
            </div>
          ) : (
            <Button type="submit" className="" variant="greenPrimary">
              Submit
            </Button>
          )}
        </form>
      </Form>
      {openLinkConfirmationDialog && airbnbLink && (
        <LinkConfirmation
          open={openLinkConfirmationDialog}
          setOpen={setOpenLinkConfirmationDialog}
          extractedLinkDataState={extractedLinkDataState}
          extractIsLoading={extractURLIsLoading}
          airbnbLink={airbnbLink}
        />
      )}
    </div>
  );
}
