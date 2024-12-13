import { Header } from "@/components/_common/Layout/header/Header";
import { StickyTopBar } from "@/pages/for-hosts";
import { MobileStickyBar } from "@/pages/for-hosts";
import { useSession } from "next-auth/react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSession({ required: true });

  return (
    <>
      {/* <Header /> */}
      <div className="md:hidden">
        <MobileStickyBar />
      </div>
      <div className="hidden md:block">
        <StickyTopBar />
      </div>
      <div className="min-h-screen-minus-header flex flex-col">{children}</div>
    </>
  );
}
