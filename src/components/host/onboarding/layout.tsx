import Header from "@/components/_common/Header";
import { useSession } from "next-auth/react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSession({ required: true });

  return (
    <>
      <Header type="dashboard" sidebarType={"host"} />
      <div className="flex min-h-screen-minus-header flex-col">{children}</div>
    </>
  );
}
