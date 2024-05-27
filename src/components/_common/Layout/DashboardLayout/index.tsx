import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
import { useIsMd } from "@/utils/utils";

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
  return (
    <>
      <Header type={session ? "dashboard" : "marketing"} sidebarType={type} />
      <div className="relative flex min-h-screen-minus-header">
        {session && (
          <aside className="sticky top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={type} />
          </aside>
        )}
        <div className="flex-1">
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
