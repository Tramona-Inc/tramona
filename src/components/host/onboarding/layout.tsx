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
        <div className="flex flex-grow">{children}</div>
        <Progress
          value={(progress * 100) / max_pages}
          className="h-2 w-full rounded-none"
        />
        <div className="flex justify-between p-5">
          <Button
            variant={"ghost"}
            onClick={() => {
              if (progress - 1 > 0) {
                setProgress(progress - 1);
              }
            }}
          >
            Back
          </Button>
          <Button onClick={() => setProgress(progress + 1)}>
            {progress > 0 ? "Next" : "Get Started"}
          </Button>
        </div>
      </div>
    </>
  );
}
