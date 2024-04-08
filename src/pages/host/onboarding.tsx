import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import Onboarding2 from "@/components/host/onboarding/Onboarding2";
import Onboarding3 from "@/components/host/onboarding/Onboarding3";
import Onboarding4 from "@/components/host/onboarding/Onboarding4";
import Onboarding5 from "@/components/host/onboarding/Onboarding5";
import Onboarding6 from "@/components/host/onboarding/Onboarding6";
import Onboarding7 from "@/components/host/onboarding/Onboarding7";
import Onboarding8 from "@/components/host/onboarding/Onboarding8";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import OnboardingLayout from "../../components/host/onboarding/layout";

export default function Onboarding() {
  const progress = useHostOnboarding((state) => state.progress);

  return (
    <OnboardingLayout>
      {progress === 0 && <Onboarding1 />}
      {progress === 1 && <Onboarding2 />}
      {progress === 2 && <Onboarding3 />}
      {progress === 3 && <Onboarding4 />}
      {progress === 4 && <Onboarding5 />}
      {progress === 5 && <Onboarding6 />}
      {progress === 6 && <Onboarding7 />}
      {progress === 7 && <Onboarding8 />}
    </OnboardingLayout>
  );
}
