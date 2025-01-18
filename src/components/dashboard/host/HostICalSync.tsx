"use client";

import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/_common/Spinner";
import { Property } from "@/server/db/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Copy, Edit2, CheckCircle, X } from "lucide-react";
import useBannerStore from "@/utils/store/bannerStore";
import HostICalHowToDialog from "./HostICalHowToDialog";

// ------------------------------------------------------------------
// A simple Progress Indicator for the multi-step flow
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
// Step 1: Introduction
// ------------------------------------------------------------------
function Step1Introduction({ onNext }: { onNext: () => void }) {
  const openAirbnb = () => {
    window.open("https://www.airbnb.com/calendar-router", "_blank");
    onNext();
  };

  return (
    <div className="space-y-6 text-center">
      <p className="text-base">
        To keep your bookings up-to-date and avoid double-bookings, we’ll
        connect your Tramona calendar to Airbnb via iCal. After you grab the
        link from Airbnb, you’ll come back here.
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
// Step 2: Show "Availability" tab screenshot
// ------------------------------------------------------------------
function Step2Availability({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-base">
        Next, click the <strong>“Availability”</strong> tab on the right side.
        Some users may see it called “Pricing & Availability.”
      </p>
      <div className="relative h-64 w-full overflow-hidden rounded-md border border-gray-300">
        {/* Replace with your real screenshot/image */}
        <img
          src="/placeholder.svg?height=256&width=448"
          alt="Airbnb calendar page with Availability tab highlighted"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 3: Connect to "Another website" screenshot
// ------------------------------------------------------------------
function Step3ConnectWebsite({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <p className="text-base">
        Scroll down until you see <strong>“Connect calendars”</strong> or
        <strong> “Connect to another website”</strong>. Click it to get the
        Airbnb iCal link (labeled “Step 1” on Airbnb). Copy that link and come
        back here.
      </p>
      <div className="relative h-64 w-full overflow-hidden rounded-md border border-gray-300">
        {/* Replace with your real screenshot/image */}
        <img
          src="/placeholder.svg?height=256&width=448"
          alt="Airbnb page with Connect to another website highlighted"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 4: Paste the Airbnb iCal Link into Tramona
// ------------------------------------------------------------------
function Step4PasteAirbnbLink({
  onNext,
  onBack,
  iCalLink,
  setICalLink,
}: {
  onNext: () => void;
  onBack: () => void;
  iCalLink: string;
  setICalLink: (val: string) => void;
}) {
  const [error, setError] = useState("");

  const validateLink = (link: string) => {
    const isValidAirbnbUrl =
      link.includes("airbnb.com/calendar/ical/") &&
      (link.endsWith(".ics") || link.includes(".ics?"));
    const isValidWebcal = link.startsWith("webcal://");
    const isValid = isValidAirbnbUrl || isValidWebcal;

    setError(
      isValid
        ? ""
        : "Please check your link. It should be a valid Airbnb iCal (.ics) or webcal:// URL.",
    );
    return isValid;
  };

  const handleNext = () => {
    if (validateLink(iCalLink)) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-base">
        Paste the Airbnb iCal link you just copied into the field below.
      </p>
      <div>
        <Label htmlFor="airbnbIcal" className="mb-1 block font-medium">
          Airbnb iCal URL
        </Label>
        <Input
          id="airbnbIcal"
          placeholder="https://www.airbnb.com/calendar/ical/XXXXXXXX.ics"
          value={iCalLink}
          onChange={(e) => setICalLink(e.target.value)}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={handleNext} disabled={!iCalLink}>
          Next
        </Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 5: Show Tramona iCal Link & let user copy it
// ------------------------------------------------------------------
function Step5TramonaIcalLink({
  onNext,
  onBack,
  tramonaLink,
}: {
  onNext: () => void;
  onBack: () => void;
  tramonaLink: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tramonaLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openAirbnbAgain = () => {
    window.open("https://www.airbnb.com/calendar-router", "_blank");
  };

  return (
    <div className="space-y-6">
      <p className="text-base">
        For a two-way sync, copy Tramona’s iCal URL below and paste it back into
        Airbnb (on the same “Connect calendars” page).
      </p>
      <div>
        <Label htmlFor="tramonaIcal" className="mb-1 block font-medium">
          Tramona iCal URL
        </Label>
        <div className="flex flex-col sm:flex-row sm:space-x-2">
          <Input
            id="tramonaIcal"
            value={tramonaLink}
            readOnly
            className="flex-grow"
          />
          <Button onClick={handleCopy}>{copied ? "Copied!" : "Copy"}</Button>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full sm:w-auto"
        onClick={openAirbnbAgain}
      >
        Need to open Airbnb again?
      </Button>
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0">
        <Button onClick={onBack} variant="outline">
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Step 6: Confirmation (submit to syncCalendar, show success)
// ------------------------------------------------------------------
function Step6Confirmation({
  onFinish,
  isLoading,
  handleFormSubmit,
  property,
}: {
  onFinish: () => void;
  isLoading: boolean;
  handleFormSubmit: () => void;
  property: Property;
}) {
  // This step can actually trigger the final form submit if you want,
  // or you can do it in Step4 / Step5. For clarity, we'll do it here:
  const finalSubmit = async () => {
    await handleFormSubmit(); // calls syncCalendar mutation
    onFinish();
  };

  return (
    <div className="space-y-6 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h3 className="text-xl font-semibold">Almost done!</h3>
      <p className="text-base">
        Once you click “Sync & Finish,” Tramona will automatically update your
        Airbnb calendar every few hours. If you need an immediate update, use
        “Sync Now” in your dashboard.
      </p>
      <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button onClick={onFinish} variant="outline">
          Cancel
        </Button>
        <Button onClick={finalSubmit} disabled={isLoading}>
          {isLoading ? "Syncing..." : "Sync & Finish"}
        </Button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// The Enhanced Multi-step Modal
// ------------------------------------------------------------------
function EnhancedICalModal({
  property,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // We'll store the iCal link here so we can pass it between steps:
  const [iCalLink, setICalLink] = useState(property.iCalLink ?? "");
  const tramonaIcalLink = `https://tramona.com/api/ics/${property.id}`;

  const { toast } = useToast();
  const { mutateAsync: syncCalendar, isLoading } =
    api.calendar.syncCalendar.useMutation();

  // The final form submit that calls your TRPC mutation
  const handleFormSubmit = async () => {
    try {
      // platformBookedOn: "airbnb" for your logic
      await syncCalendar({
        iCalLink,
        propertyId: property.id,
        platformBookedOn: "airbnb",
      });
      toast({
        title: "Success!",
        description: "Your iCal calendar has been successfully synced.",
      });
    } catch (error) {
      console.error("Error syncing calendar:", error);
      toast({
        title: "No calendar data found",
        description: "Please make sure the iCal URL is correct and try again.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleFinish = () => {
    setCurrentStep(1);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Introduction onNext={handleNext} />;
      case 2:
        return <Step2Availability onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <Step3ConnectWebsite onNext={handleNext} onBack={handleBack} />;
      case 4:
        return (
          <Step4PasteAirbnbLink
            onNext={handleNext}
            onBack={handleBack}
            iCalLink={iCalLink}
            setICalLink={setICalLink}
          />
        );
      case 5:
        return (
          <Step5TramonaIcalLink
            onNext={handleNext}
            onBack={handleBack}
            tramonaLink={tramonaIcalLink}
          />
        );
      case 6:
        return (
          <Step6Confirmation
            onFinish={handleFinish}
            isLoading={isLoading}
            handleFormSubmit={handleFormSubmit}
            property={property}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DialogContent className="w-full max-w-3xl p-8 sm:w-auto">
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Sync Your iCal</h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Follow these steps to connect Tramona & Airbnb and avoid double
          bookings.
        </DialogDescription>
      </DialogHeader>

      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      {renderStep()}
    </DialogContent>
  );
}

// ------------------------------------------------------------------
// Main HostICalSync Component
// ------------------------------------------------------------------
export default function HostICalSync({
  property,
}: {
  property: Property | null;
}) {
  const { setIsCalendar } = useBannerStore();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (property && !property.iCalLink) {
      setIsCalendar(true);
    }
  }, [property, setIsCalendar]);

  if (!property) {
    return <Spinner />;
  }

  const handleCopyICalLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://tramona.com/api/ics/${property.id}`,
      );
      toast({
        title: "Copied!",
        description: "The iCal link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy the iCal link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="mt-4 lg:mt-8">
          {property.iCalLink ? (
            <Button variant="secondary">Edit iCal Link</Button>
          ) : (
            <Button size="lg">Sync your iCal</Button>
          )}
        </DialogTrigger>

        {/* Our Enhanced Multi-step Wizard */}
        {open && (
          <EnhancedICalModal
            property={property}
            onClose={() => setOpen(false)}
          />
        )}
      </Dialog>

      {/* If you still want to display any info outside the modal, you can do so here.
          But we've moved the main "Edit iCal" logic into the multi-step wizard. */}

      {/* Example: A "How to" dialog button, if needed */}
      <div className="mt-4">
        <HostICalHowToDialog />
      </div>

      {/* Example: Show Tramona iCal link copy button outside or wherever you want */}
      <div className="mt-2 flex items-center space-x-2">
        <Label className="font-semibold">
          Your Tramona iCal Link (for external apps):
        </Label>
        <Input
          readOnly
          className="w-72"
          value={`https://tramona.com/api/ics/${property.id}`}
        />
        <Button onClick={handleCopyICalLink}>
          <Copy className="mr-1 h-4 w-4" />
          Copy
        </Button>
      </div>
    </div>
  );
}
