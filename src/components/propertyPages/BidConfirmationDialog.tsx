import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";
import Confetti from "react-confetti";

interface BidPlacedPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  onSubmitMoreBids?: () => void;
  onSubmitRequest?: () => void;
}

export default function BidPlacedPopup({
  isOpen,
  onClose,
  onSubmitMoreBids,
  onSubmitRequest,
}: BidPlacedPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [open, setOpen] = useState(isOpen);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose && typeof onClose === "function") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen, handleClose]);

  const handleSubmitMoreBids = useCallback(() => {
    if (onSubmitMoreBids && typeof onSubmitMoreBids === "function") {
      onSubmitMoreBids();
    }
  }, [onSubmitMoreBids]);

  const handleSubmitRequest = useCallback(() => {
    if (onSubmitRequest && typeof onSubmitRequest === "function") {
      onSubmitRequest();
    }
  }, [onSubmitRequest]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="mb-4 h-12 w-12 text-[#004236]" />
          <h2 className="mb-4 text-2xl font-bold text-black">
            Your Bid Has Been Placed!
          </h2>
          <p className="mb-4 text-base text-black">
            Your bid has been successfully submitted. The host has 24 hours to
            respond.
          </p>
          <div className="mb-6 text-left">
            <p className="mb-2 text-black">
              <strong>Next Steps:</strong>
            </p>
            <div className="mb-4 flex items-start">
              <CheckCircle className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-[#004236]" />
              <p className="text-left text-[#6D6D6A]">
                Place more bids to improve your chances of getting the best
                price.
              </p>
            </div>
            <div className="mb-4 flex items-start">
              <CheckCircle className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-[#004236]" />
              <p className="text-left text-[#6D6D6A]">
                Submit requests to see exclusive prices that hosts are willing
                to offer.
              </p>
            </div>
          </div>
          <Alert className="mb-6 text-left">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-[#6D6D6A]">
              If one of your bids is accepted, it will be instantly booked and
              all other bids will be automatically withdrawn.
            </AlertDescription>
          </Alert>
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-4 sm:flex-row">
              <Button
                className="w-full bg-[#004236] text-white hover:bg-[#003228]"
                onClick={handleSubmitMoreBids}
              >
                Search More Properties
              </Button>
              <Button
                className="w-full bg-[#004236] text-white hover:bg-[#003228]"
                onClick={handleSubmitRequest}
              >
                View Requests
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full border-[#004236] text-[#004236] hover:bg-[#004236] hover:text-white"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
        {showConfetti && (
          <div className="z-100 pointer-events-none fixed inset-0">
            <Confetti width={window.innerWidth} recycle={false} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
