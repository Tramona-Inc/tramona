import Header from "@/components/_common/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useHostOnboarding } from "@/utils/store/host-onboarding";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const max_pages = 10;

  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);

  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">
        <div className="w-full flex-grow max-sm:container lg:grid lg:grid-cols-2">
          {children}
        </div>
        <Progress value={progress * 10} className="h-2 w-full rounded-none" />
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
          <Button onClick={() => setProgress(progress + 1)}>Get Started</Button>
        </div>
      </div>
    </>
  );
}
