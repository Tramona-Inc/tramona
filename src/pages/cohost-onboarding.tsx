import CohostOnboarding1 from "@/components/cohost/onboarding/CohostOnboarding1";
import { useCohostOnboarding } from "@/utils/store/cohost-onboarding";
import OnboardingLayout from "../components/host/onboarding/layout";

export default function CohostOnboarding() {
  const progress = useCohostOnboarding((state) => state.progress);
  const setProgress = useCohostOnboarding((state) => state.setProgress);

  function onPressNext() {
    setProgress(progress + 1);
  }

  return (
    <OnboardingLayout>
      {progress === 0 && <CohostOnboarding1 />}
      {/* {progress === 8 && <Onboarding9 onPressNext={onPressNext}/>}
      {progress === 9 && <Onboarding10 />}
      {progress === 10 && <OnboardingLinkInput />}
      {progress === 11 && <Onboarding11 />} */} */}
    </OnboardingLayout>
  );
}
