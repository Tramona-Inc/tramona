import Header from "@/components/_common/Header";
import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import { Button } from "@/components/ui/button";
import { useHostOnboarding } from "@/utils/store/host-onboarding";

export default function Onboarding() {
  const progress = useHostOnboarding((state) => state.progress);

  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">
        <div className="w-full flex-grow max-sm:container lg:grid lg:grid-cols-2">
          <Onboarding1 />
        </div>
        <div className="flex justify-end border-t-[5px] p-5">
          <Button>Get Started</Button>
        </div>
      </div>
    </>
  );
}
