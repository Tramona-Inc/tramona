import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangeInput from "@/components/_common/DateRangeInput";
import { CalendarIcon, Users2Icon } from "lucide-react";
import Spinner from "@/components/_common/Spinner";
import { useLinkRequestForm } from "./useLinkRequestForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/utils/api";
import RequestSubmittedDialog from "./DesktopRequestComponents/RequestSubmittedDialog";
interface LinkConfirmationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  extractedLinkDataState:
    | {
        checkIn: string;
        checkOut: string;
        numOfGuests: number;
      }
    | undefined;
  extractIsLoading: boolean;
  airbnbLink: string;
  //onSubmit: () => void;
}

const LinkConfirmation: React.FC<LinkConfirmationProps> = ({
  open,
  setOpen,
  extractedLinkDataState,
  extractIsLoading,
  airbnbLink,
  //onSubmit,
}) => {
  const [requestSubmittedDialogOpen, setRequestSubmittedDialogOpen] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupId, setMadeByGroupId] = useState<number>();
  const [groupId, setGroupId] = useState<number | null>(null);

  const { form, onSubmit } = useLinkRequestForm({ afterSubmit });

  useEffect(() => {
    if (extractedLinkDataState) {
      const checkInDate = new Date(extractedLinkDataState.checkIn);
      const checkOutDate = new Date(extractedLinkDataState.checkOut);

      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        form.setValue("date.from", checkInDate);
        form.setValue("date.to", checkOutDate);
        form.setValue("numGuests", extractedLinkDataState.numOfGuests);
        form.setValue("airbnbLink", airbnbLink);
      } else {
        console.error("Invalid date extracted", { checkInDate, checkOutDate });
      }
    }
  }, [extractedLinkDataState, airbnbLink]);

  const handleConfirm = () => {
    setOpen(false);
    onSubmit().catch((e) => {
      console.error("Error submitting link request", e);
    });
  };

  const handleCancel = () => {
    setOpen(false);
    form.reset(); // Reset the form
  };

  function afterSubmit(madeByGroupId?: number) {
    setOpen(false);
    setRequestSubmittedDialogOpen(true);
    setShowConfetti(true);
    form.reset();
    if (madeByGroupId !== undefined) {
      setMadeByGroupId(madeByGroupId);
      setGroupId(madeByGroupId);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader></DialogHeader>
        <DialogContent className="p-12">
          <h3 className="mb-10 text-center text-xl font-semibold">
            Please confirm your request details
          </h3>
          <Form {...form}>
            <form
              className="flex flex-col gap-y-4"
              onSubmit={form.handleSubmit(handleConfirm)}
            >
              {extractIsLoading ? (
                <Spinner />
              ) : (
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`date`}
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
                    name={`numGuests`}
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
                    name="airbnbLink"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Airbnb Link"
                        placeholder={airbnbLink ?? ""}
                        disabled
                        icon={Users2Icon}
                        variant="lpDesktop"
                      />
                    )}
                  />
                </div>
              )}
              <div className="flex w-full flex-row-reverse justify-between gap-x-2">
                <Button onClick={handleCancel} variant="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={extractIsLoading}
                  variant="greenPrimary"
                >
                  {extractIsLoading ? "Submitting..." : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <RequestSubmittedDialog
        open={requestSubmittedDialogOpen}
        setOpen={setRequestSubmittedDialogOpen}
        showConfetti={showConfetti}
        madeByGroupId={madeByGroupId}
        form={form}
      />
    </div>
  );
};

export default LinkConfirmation;
