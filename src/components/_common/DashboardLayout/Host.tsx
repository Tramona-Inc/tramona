import DashboardSidebar, {
  type NavLink,
} from "@/components/dashboard/DashboardSidebar";

const navLinks: NavLink[] = [{ href: "/messages", name: "Messages" }];

export default function HostDashboardLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <>
      <div className="grid min-h-[calc(100vh-4.5rem)] grid-cols-1 lg:grid-cols-12">
        <DashboardSidebar navLinks={navLinks} />
        {children}
      </div>
    </>
  );
}
