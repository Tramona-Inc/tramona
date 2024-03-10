import { type NavLink } from "@/components/dashboard/DashboardSidebar";
import HostDashboardSidebar from "@/components/dashboard/HostDashboardSidebar";

const navLinks: NavLink[] = [
  { href: "/host", name: "Overview" },
  { href: "/messages", name: "Messages" },
];

export default function HostDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <div className="container grid h-screen flex-1 gap-12 pt-[56px] sm:pt-[72px] lg:grid-cols-[125px_1fr]">
      <aside className="hidden w-[125px] flex-col lg:flex">
        <HostDashboardSidebar navLinks={navLinks} />
      </aside>
      <main className="flex h-full w-full flex-1 flex-col overflow-hidden border-x">
        {children}
      </main>
    </div>
  );
}
