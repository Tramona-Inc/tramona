import MobileNav from "@/components/dashboard/MobileNav";
import { useSession } from "next-auth/react";
import Footer from "../Footer";
import { useIsMd } from "@/utils/utils";
import { api } from "@/utils/api";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "../header/Header";
import MessagesPopover from "@/components/messages/chat-with-admin-popover/MessagesPopover";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function HostDashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { status } = useSession();
  const isMd = useIsMd();

  const router = useRouter();

  const { data: verifications } = api.users.getMyVerifications.useQuery();

  useEffect(() => {
    if (verifications?.phoneNumber === null) {
      void router.push("/auth/onboarding");
    } else if (verifications?.dateOfBirth === null) {
      void router.push("/auth/onboarding-1");
    } else if (verifications?.firstName === null) {
      void router.push("/auth/onboarding-2");
    }
  }, [verifications, router]);

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
      <div className="relative min-h-screen-minus-header overflow-x-hidden lg:flex">
        <main className="relative min-h-[calc(100vh-4rem-3rem)] lg:flex-1">
          {children}
        </main>
        {status !== "loading" && <MobileNav type={navType} />}
        <div className="hidden md:contents">
          {/* <MessagesPopover isMobile={false} isHostOnboarding={true} /> */}
        </div>
      </div>
      {isMd && <Footer />}
    </>
  );
}
