import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
import { useIsMd } from "@/utils/utils";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useEffect } from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
  type: "admin" | "host" | "guest" | "unlogged";
};

export default function DashboardLayout({
  children,
  type,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const isMd = useIsMd();

  const router = useRouter();

  const { data: onboardingStep } = api.users.getOnboardingStep.useQuery();

  useEffect(() => {
    if (onboardingStep !== undefined && onboardingStep < 3) {
      if (onboardingStep === 0) {
        void router.push("/auth/onboarding");
      } else if (onboardingStep === 1) {
        void router.push("/auth/onboarding-1");
      } else if (onboardingStep === 2) {
        void router.push("/auth/onboarding-2");
      }
    }
  }, [onboardingStep, router]);

  return (
    <>
      <Header type={session ? "dashboard" : "marketing"} sidebarType={type} />
      <div className="relative min-h-screen-minus-header lg:flex">
        {session && (
          <aside className="sticky top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={type} />
          </aside>
        )}
        <div className="min-w-0 lg:flex-1">
          <main className="relative min-h-screen-minus-header">{children}</main>
          {session ? (
            <MobileNav type={type} />
          ) : (
            <MobileNav type={"unlogged"} />
          )}
          {isMd && <Footer />}
        </div>
      </div>
    </>
  );
}
