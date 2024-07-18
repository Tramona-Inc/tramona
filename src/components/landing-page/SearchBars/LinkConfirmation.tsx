import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangeInput from "@/components/_common/DateRangeInput";
import { CalendarIcon, Users2Icon } from "lucide-react";
import Spinner from "@/components/_common/Spinner";

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
  formControl: Control<any>;
  formFields: {
    checkIn: string;
    checkOut: string;
    numGuests: string;
  };
  onSubmit: () => void;
}

const LinkConfirmation: React.FC<LinkConfirmationProps> = ({
  open,
  setOpen,
  extractedLinkDataState,
  extractIsLoading,
  formControl,
  formFields,
  onSubmit,
}) => {
  const { setValue, watch, reset } = useFormContext();

  useEffect(() => {
    console.log("extractedLinkDataState", extractedLinkDataState);
    if (extractedLinkDataState) {
      const checkInDate = new Date(extractedLinkDataState.checkIn);
      const checkOutDate = new Date(extractedLinkDataState.checkOut);

      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
        setValue(formFields.checkIn, checkInDate);
        setValue(formFields.checkOut, checkOutDate);
        setValue(formFields.numGuests, extractedLinkDataState.numOfGuests);
      } else {
        console.error("Invalid date extracted", { checkInDate, checkOutDate });
      }
    }
  }, [extractedLinkDataState]);

  const checkInValue = watch(formFields.checkIn) as Date | undefined;
  const checkOutValue = watch(formFields.checkOut) as Date | undefined;
  const numGuestsValue = watch(formFields.numGuests) as number;

  const handleConfirm = () => {
    setOpen(false);
    onSubmit(); // Call the form submit handler
  };

  const handleCancel = () => {
    setOpen(false);
    reset(); // Reset the form
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col">
        <h2>Confirm Booking Details</h2>
        {extractIsLoading ? (
          <Spinner />
        ) : (
          <div>
            <Controller
              name={formFields.checkIn}
              control={formControl}
              render={({ field }) => (
                <DateRangeInput
                  {...field}
                  label="Check In/Out"
                  icon={CalendarIcon}
                  variant="lpDesktop"
                  disablePast
                  className="bg-white"
                  onChange={(value) => {
                    setValue(formFields.checkIn, value?.from ?? undefined);
                    setValue(formFields.checkOut, value?.to ?? undefined);
                  }}
                  value={{ from: checkInValue, to: checkOutValue }}
                />
              )}
            />
            <Controller
              name={formFields.numGuests}
              control={formControl}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Number of Guests"
                  placeholder="Add guests"
                  icon={Users2Icon}
                  variant="lpDesktop"
                  onChange={(e) =>
                    setValue(formFields.numGuests, Number(e.target.value))
                  }
                  value={numGuestsValue || ""}
                />
              )}
            />
          </div>
        )}
        <div className="flex w-full justify-between gap-x-2">
          <Button
            onClick={handleConfirm}
            disabled={extractIsLoading}
            variant="greenPrimary"
          >
            {extractIsLoading ? "Submitting..." : "Submit Request"}
          </Button>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkConfirmation;
