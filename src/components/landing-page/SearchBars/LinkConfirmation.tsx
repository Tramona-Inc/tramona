import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateRangeInput from "@/components/_common/DateRangeInput";
import { CalendarIcon, Users2Icon } from "lucide-react";

const LinkConfirmation = ({
  open,
  setOpen,
  extractedLinkDataState,
  extractIsLoading,
  formControl,
  formFields,
  onSubmit,
}) => {
  const { setValue, getValues } = useFormContext();

  const checkInValue = getValues(formFields.checkIn) || null;
  const checkOutValue = getValues(formFields.checkOut) || null;

  const handleConfirm = async () => {
    if (extractedLinkDataState) {
      const checkInDate = new Date(extractedLinkDataState.checkIn);
      const checkOutDate = new Date(extractedLinkDataState.checkOut);

      if (!isNaN(checkInDate) && !isNaN(checkOutDate)) {
        setValue(formFields.checkIn, checkInDate);
        setValue(formFields.checkOut, checkOutDate);
        setValue(formFields.numGuests, extractedLinkDataState.numGuests);
      }
    }

    setOpen(false);
    onSubmit(); // Call the form submit handler
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col">
        <h2>Confirm Booking Details</h2>
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
                  setValue(formFields.checkIn, value.from);
                  setValue(formFields.checkOut, value.to);
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
                onChange={(e) => setValue(formFields.numGuests, e.target.value)}
              />
            )}
          />
        </div>
        <div className="flex w-full justify-between gap-x-2">
          <Button
            onClick={handleConfirm}
            disabled={extractIsLoading}
            variant="greenPrimary"
          >
            {extractIsLoading ? "Submitting..." : "Submit Request"}
          </Button>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkConfirmation;
