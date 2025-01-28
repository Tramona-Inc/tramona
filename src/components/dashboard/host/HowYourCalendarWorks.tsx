import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import Step1 from "@/../public/assets/images/how-cal-works-modal/Step1.png";
import Step2 from "@/../public/assets/images/how-cal-works-modal/Step2.png";
// ------------------------------------------------------------------
// A simple Progress Indicator for the multi-step flow - REUSED from HostICalSync
// ------------------------------------------------------------------
function ProgressIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const progress = (currentStep / totalSteps) * 100;
  return (
    <div className="mb-6 flex flex-col items-center space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
      <div className="text-sm font-medium">
        Step {currentStep} of {totalSteps}
      </div>
      <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 1: Explanation of Calendar Sync
// ------------------------------------------------------------------
function Step1Explanation({ onNext }: { onNext: () => void }) {
  const openAirbnb = () => {
    window.open("https://www.airbnb.com/calendar-router", "_blank");
    onNext();
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-base">
        We sync pull data from Airbnb every 5 minutes to ensure there is no
        double bookings on our site.
      </p>
      <p className="text-base">
        However, Airbnb only lets us send them data automatically every 2 hours.
        However, you can instantly sync them here.
      </p>
      <p className="text-base">
        When you do a booking on Tramona, we will notify you instantly and
        request you manually sync, if not, we will do it every 2 hours.
      </p>
      <Button
        onClick={openAirbnb}
        size="lg"
        className="mx-auto block w-full sm:w-auto"
      >
        Open Airbnb Calendar
      </Button>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 2: Screenshot 1 (Placeholder - Replace with actual screenshot)
// ------------------------------------------------------------------
function Step2Screenshot1({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-base">
        {/* Instruction text for Screenshot 1 - REPLACE */}
        This is where the first screenshot will go. Imagine this is a helpful
        visual guide for syncing your calendar.
      </p>
      <div className="relative h-64 w-full overflow-hidden rounded-md border border-gray-300">
        <Image
          src={Step1}
          alt="Screenshot 1"
          width={500}
          height={300}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        {/* <Button onClick={onBack} variant="outline">
          Back
        </Button> */}{" "}
        {/* Back button might not be needed for this modal */}
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 3: Screenshot 2 (Placeholder - Replace with actual screenshot)
// ------------------------------------------------------------------
function Step3Screenshot2({
  onDone,
  onBack,
}: {
  onDone: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-base">
        {/* Instruction text for Screenshot 2 - REPLACE */}
        This is where the second screenshot will go. Another helpful visual to
        guide users.
      </p>
      <div className="relative h-64 w-full overflow-hidden rounded-md border border-gray-300">
        <Image
          src={Step2}
          alt="Screenshot 2"
          width={500}
          height={300}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onDone}>Done</Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 4: Confirmation - Done
// ------------------------------------------------------------------
function Step4Done({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <h3 className="text-xl font-semibold">You&apos;re all set!</h3>
      <p className="text-base">
        You now understand how the calendar sync works.
      </p>
      <Button onClick={onClose} variant="primary">
        Done
      </Button>
    </div>
  );
}

// ------------------------------------------------------------------
// HowYourCalendarWorksModal Component
// ------------------------------------------------------------------
function HowYourCalendarWorksModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // Explanation, Screenshot 1, Screenshot 2, Done

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleDone = () => {
    setCurrentStep(1); // Reset step to 1 for next open
    onOpenChange(false); // Close the modal
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Explanation onNext={handleNext} />;
      case 2:
        return <Step2Screenshot1 onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3Screenshot2 onDone={handleDone} onBack={handleBack} />;
      // case 4:
      //   return <Step4Done onClose={handleDone} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="primary">How Calendar Sync Works</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-3xl p-8 sm:w-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">How Your Calendar Works</h1>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Learn more about how Tramona syncs with Airbnb.
          </DialogDescription>
        </DialogHeader>

        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}

export default HowYourCalendarWorksModal;
