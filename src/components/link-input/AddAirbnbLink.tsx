import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useForm } from "react-hook-form";
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
import LinkConfirmation from "@/components/landing-page/SearchBars/LinkConfirmation";
import { api, type RouterOutputs } from "@/utils/api";
import { Link2 } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
type ExtractURLType = RouterOutputs["misc"]["extractBookingDetails"];

interface AddAirbnbProps {
  setIsLinkActive?: (val: boolean) => void;
  fromRequestDealTab: boolean;
}
export interface AddAirbnbLinkRef {
  handleExtractClick: () => void;
}

const AddAirbnbLink = forwardRef<any, AddAirbnbProps>(
  ({ setIsLinkActive, fromRequestDealTab }, ref) => {
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

    const [triggerExtract, setTriggerExtract] = useState(false);
    const [openLinkConfirmationDialog, setOpenLinkConfirmationDialog] =
      useState(false);
    const [airbnbLink, setAirbnbLink] = useState<string | null>(null);
    const [extractedLinkDataState, setExtractedLinkDataState] = useState<
      ExtractURLType | undefined
    >(undefined);

    useImperativeHandle(ref, () => ({
      handleExtractClick: () => {
        setTriggerExtract((prev) => !prev);
      },
    }));

    const handleCancelClick = () => {
      if (fromRequestDealTab && setIsLinkActive) {
        setIsLinkActive(false);
      }
      form.reset();
    };
    const handleClearClick = () => {
      form.reset();
    };

    const {
      data: extractedData,
      refetch: refetchExtractedData,
      isLoading: extractURLIsLoading,
    } = api.misc.extractBookingDetails.useQuery(airbnbLink!, {
      enabled: false,
      onError: (error) => {
        toast({
          title: "Failed to extract booking details from query",
          description: `Please try again, or another link. Error:  + ${error.message}`,
          variant: "destructive",
        });
      },
      onSuccess: (data) => {
        setExtractedLinkDataState(data);
        setOpenLinkConfirmationDialog(true);
      },
    });

    useEffect(() => {
      if (!airbnbLink) return;
      void refetchExtractedData();
      setExtractedLinkDataState(extractedData);
      console.log("extractedData", extractedData);
      if (extractedLinkDataState) {
        setOpenLinkConfirmationDialog(true);
      }
    }, [triggerExtract]);

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
                  onClick={handleCancelClick}
                  className=""
                  variant="outline"
                >
                  Cancel
                </Button>{" "}
              </div>
            ) : (
              <div className="flex flex-row gap-x-1">
                {" "}
                <Button type="submit" className="" variant="greenPrimary">
                  Submit
                </Button>
                {airbnbLink && (
                  <Button onClick={handleClearClick} variant="outline">
                    Clear
                  </Button>
                )}
              </div>
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
  },
);

AddAirbnbLink.displayName = "AddAirbnbLink";

export default AddAirbnbLink;
