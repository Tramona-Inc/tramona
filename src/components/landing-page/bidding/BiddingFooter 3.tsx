import { Button } from "@/components/ui/button";
import { useBidding } from "@/utils/store/listingBidding";

type BiddingFooterProps = {
  handleNext?: () => void;
  isFormValid?: boolean;
  isForm?: boolean;
  handleError?: () => void;
};

export default function BiddingFooter({ handleNext }: BiddingFooterProps) {
  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);
  function onPressNext() {
    if (step == 2) {
      //send in the form
    } else {
      //call the next form
      setStep(step + 1);
    }
  }
  return (
    <div className="sticky bottom-0 w-full tracking-tight flex items-center justify-center">
      <div className="flex justify-between p-5 w-4/5">
        {step !== 0 && (
          <Button
          className="w-full"
            variant={"ghost"}
            onClick={() => {
              if (step - 1 > -1) {
                setStep(step - 1);
              }
            }}
          >
            Back
          </Button>
        )}
        <div className="w-full flex flex-col items-center">
        <Button onClick={onPressNext} className="w-full md:w-96">
          {step === 0
            ? "Review Offer"
            : step === 1
              ? "Send Offer"
              : "See my offers"}
        </Button>
        <p className="text-sm mt-2 text-muted-foreground">Payment information will be taken in the next step.</p>

        </div>
        
      </div>
    </div>
  );
}
