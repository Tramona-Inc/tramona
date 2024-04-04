import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import Onboarding2 from "@/components/host/onboarding/Onboarding2";
import Onboarding3 from "@/components/host/onboarding/Onboarding3";
import Onboarding4 from "@/components/host/onboarding/Onboarding4";
import Onboarding5 from "@/components/host/onboarding/Onboarding5";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import OnboardingLayout from "../../components/host/onboarding/layout";
import Onboarding6 from '@/components/host/onboarding/Onboarding6';

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
    </OnboardingLayout>
  );
}
