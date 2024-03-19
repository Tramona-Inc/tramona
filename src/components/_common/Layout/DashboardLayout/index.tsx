import Sidebar from "@/components/dashboard/Sidebar";
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
  return (
    <>
      <Header type="dashboard" sidebarType={type} />
      <div className="flex">
        <aside className="sticky bottom-0 top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
          <Sidebar type={type} />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
