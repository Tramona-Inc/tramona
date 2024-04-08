import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHostOnboarding } from "@/utils/store/host-onboarding";

type OnboardingFooterProps = {
  handleNext?: () => void;
  isFormValid?: boolean; // New prop to indicate whether the form is valid
  isForm: boolean;
};

export default function OnboardingFooter({
  handleNext,
  isFormValid = false, // Default value is false
  isForm,
}: OnboardingFooterProps) {
  const max_pages = 10;

  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);

  function onPressNext() {
    if (isFormValid) {
      handleNext && handleNext(); // Call handleNext only if it exists
      setProgress(progress + 1);
    }
    if (!isForm) {
      setProgress(progress + 1);
    }
  }

  return (
    <>
      <Progress
        value={(progress * 100) / max_pages}
        className="h-2 w-full rounded-none"
      />
      <div className="flex justify-between p-5">
        <Button
          variant={"ghost"}
          onClick={() => {
            if (progress - 1 > -1) {
              setProgress(progress - 1);
            }
          }}
        >
          Back
        </Button>
        <Button onClick={onPressNext}>
          {progress > 0 ? "Next" : "Get Started"}
        </Button>
      </div>
    </>
  );
}
