import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import Onboarding2 from "@/components/host/onboarding/Onboarding2";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import OnboardingLayout from "../../components/host/onboarding/layout";

export default function Onboarding() {
  const progress = useHostOnboarding((state) => state.progress);

  return (
    <OnboardingLayout>
      {progress === 0 && <Onboarding1 />}
      {progress === 1 && <Onboarding2 />}
    </OnboardingLayout>
  );
}
