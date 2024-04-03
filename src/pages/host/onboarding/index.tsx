import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import OnboardingLayout from "./layout";

export default function Onboarding() {
  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);

  return (
    <OnboardingLayout>
      {progress === 0 && <Onboarding1 />}
      {progress === 1 && <Onboarding1 />}
    </OnboardingLayout>
  );
}
