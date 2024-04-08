import Header from "@/components/_common/Header";
import OnboardingFooter from "./OnboardingFooter";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">
        <div className="flex flex-grow">{children}</div>
        <OnboardingFooter />
      </div>
    </>
  );
}
