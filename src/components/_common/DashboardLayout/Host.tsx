import { type NavLink } from "@/components/dashboard/DashboardSidebar";
import HostDashboardSidebar from "@/components/dashboard/HostDashboardSidebar";

const navLinks: NavLink[] = [{ href: "/messages", name: "Messages" }];

export default function HostDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="container grid h-[calc(100vh-4em)] flex-1 gap-12 lg:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col lg:flex">
        <HostDashboardSidebar navLinks={navLinks} />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
