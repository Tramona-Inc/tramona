import { useMediaQuery } from "@/components/_utils/useMediaQuery";
import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
type DashboardLayoutProps = {
  children: React.ReactNode;
  type: "admin" | "host" | "guest" | "unlogged";
};

export default function DashboardLayout({
  children,
  type,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const isBelowMediumScreen = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <Header type={session ? "dashboard" : "marketing"} sidebarType={type} />
      <div className="flex min-h-screen-minus-header">
        {session && (
          <aside className="sticky bottom-0 top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={type} />
          </aside>
        )}
        <main className="flex-1">{children}</main>
      </div>
      {session ? <MobileNav type={type} /> : <MobileNav type={"unlogged"} />}
      {!isBelowMediumScreen && <Footer />}
    </>
  );
}
