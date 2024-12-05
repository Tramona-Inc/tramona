import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { useState } from "react";
import { cn } from "@/utils/utils";
import OnboardingFooter from "./OnboardingFooter";
import SaveAndExit from "./SaveAndExit";
import { Checkbox } from "@/components/ui/checkbox";

export default function Onboarding11({ editing = false }) {
  const bookItNowEnabled = useHostOnboarding(
    (state) => state.listing.bookItNowEnabled,
  );
  const setBookItNowEnabled = useHostOnboarding(
    (state) => state.setBookItNowEnabled,
  );
  const [error, setError] = useState(false);
  const [isChecked, setIsChecked] = useState(bookItNowEnabled);

  function handleFormSubmit() {
    setBookItNowEnabled(isChecked);
  }

  function handleError() {
    setError(true);
  }

  return (
    <>
      {!editing && <SaveAndExit />}
      <div className="mx-auto mb-10 flex max-w-3xl flex-grow flex-col justify-center space-y-5">
        <h1
          className={`text-4xl font-bold ${cn(editing && "text-center text-xl")}`}
        >
          Enable &quot;Book It Now&quot; feature
        </h1>
        {error && <p className="text-red-500">Please make a selection</p>}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="bookItNow"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked as boolean)}
          />
          <label
            htmlFor="bookItNow"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable &quot;Book It Now&quot;
          </label>
        </div>

        <p className="text-sm text-gray-600">
          By enabling &quot;Book It Now&quot;, guests can instantly book your
          property without requiring your approval for each reservation. This
          can increase your bookings, but you&apos;ll have less control over who
          stays at your property.
        </p>
      </div>
      {!editing && (
        <OnboardingFooter
          handleNext={handleFormSubmit}
          isFormValid={true}
          isForm={true}
          handleError={handleError}
        />
      )}
    </>
  );
}
