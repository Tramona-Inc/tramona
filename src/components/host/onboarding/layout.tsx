import Header from "@/components/_common/Header";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">
        <div className="flex flex-grow flex-col">{children}</div>
        {/* <OnboardingFooter /> */}
      </div>
    </>
  );
}
