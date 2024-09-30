import CohostOnboarding1 from "@/components/cohost/onboarding/CohostOnboarding1";
import CohostOnboarding2 from "@/components/cohost/onboarding/CohostOnboarding2";
import CohostOnboarding3 from "@/components/cohost/onboarding/CohostOnboarding3";
import CohostOnboarding4 from "@/components/cohost/onboarding/CohostOnboarding4";

import { useCohostOnboarding } from "@/utils/store/cohost-onboarding";
import OnboardingLayout from "../components/host/onboarding/layout";
import Onboarding10 from "@/components/host/onboarding/Onboarding10";
import Onboarding11 from "@/components/host/onboarding/Onboarding11";
import OnboardingLinkInput from "@/components/host/onboarding/OnboardingLinkInput";

export default function CohostOnboarding() {
  const progress = useCohostOnboarding((state) => state.progress);
  const setProgress = useCohostOnboarding((state) => state.setProgress);

  function onPressNext() {
    setProgress(progress + 1);
  }

  return (
    <OnboardingLayout>
      {progress === 0 && <CohostOnboarding1 onPressNext={onPressNext} />}
      {progress === 1 && <CohostOnboarding2 />}
      {progress === 2 && <CohostOnboarding3 />}
      {progress === 3 && <CohostOnboarding4 />}
      {/* {progress === 4 && <Onboarding5 />}
      {progress === 5 && <Onboarding6 />}
      {progress === 6 && <Onboarding7 />}
      {progress === 7 && <Onboarding8 />}
      {progress === 8 && <Onboarding9 />}
      {progress === 9 && <Onboarding10 />}
      {progress === 10 && <OnboardingLinkInput />}
      {progress === 11 && <Onboarding11 />} */}
    </OnboardingLayout>
  );
}
