import Header from "@/components/_common/Header";
import Onboarding1 from "@/components/host/onboarding/Onboarding1";
import { Button } from "@/components/ui/button";
import { useHostOnboarding } from "@/utils/store/host-onboarding";

export default function Onboarding() {
  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);

  function inc() {
    setProgress(progress + 1);
  }

  function dec() {
    setProgress(progress - 1);
  }

  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">
        <div className="w-full flex-grow max-sm:container lg:grid lg:grid-cols-2">
          <Onboarding1 />
        </div>
        <div className="flex justify-end border-t-[5px] p-5">
          <div
            className="flex h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
            role="progressbar"
          >
            <div
              className={`w-[${progress * 10}%] flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-blue-600 text-center text-xs text-white transition duration-500 dark:bg-blue-500`}
            >
              {progress * 10}
            </div>
          </div>

          <Button>Get Started</Button>
          {progress}
          <Button onClick={() => inc()}>+</Button>
          <Button onClick={() => dec()}>-</Button>
        </div>
      </div>
    </>
  );
}
