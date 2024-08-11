import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Footer from "../Footer";
import { useIsMd } from "@/utils/utils";
import { api } from "@/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../header/Header";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const isMd = useIsMd();

  const router = useRouter();

  const { data: onboardingStep } = api.users.getOnboardingStep.useQuery();

  useEffect(() => {
    if (onboardingStep != null && onboardingStep < 3) {
      if (onboardingStep === 0) {
        void router.push("/auth/onboarding");
      } else if (onboardingStep === 1) {
        void router.push("/auth/onboarding-1");
      } else if (onboardingStep === 2) {
        void router.push("/auth/onboarding-2");
      }
    }
  }, [onboardingStep, router]);

  const { pathname } = useRouter();

  const navType =
    status === "unauthenticated"
      ? "unlogged"
      : pathname.startsWith("/host")
        ? "host"
        : pathname.startsWith("/admin")
          ? "admin"
          : "guest";

  return (
    <>
      <Header />
      <div className="relative min-h-screen-minus-header lg:flex">
        {session && (
          <aside className="sticky top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={navType} />
          </aside>
        )}
        <div className="min-w-0 lg:flex-1">
          <main className="relative min-h-screen-minus-header">{children}</main>
          {status !== "loading" && <MobileNav type={navType} />}
          {isMd && <Footer />}
        </div>
      </div>
    </>
  );
}
