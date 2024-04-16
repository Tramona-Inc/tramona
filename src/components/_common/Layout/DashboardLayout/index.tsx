import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../Footer";

type DashboardLayoutProps = {
  children: React.ReactNode;
  type: "admin" | "host" | "guest";
};

export default function DashboadLayout({
  children,
  type,
}: DashboardLayoutProps) {
  const { data: session } = useSession();

  return (
    <>
      <Header type={session ? "dashboard" : "marketing"} sidebarType={type} />
      <div className="flex">
        {session && (
          <aside className="sticky bottom-0 top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={type} />
          </aside>
        )}
        <main className="flex-1">{children}</main>
      </div>
      <MobileNav type={type} />
      <Footer />
    </>
  );
}
