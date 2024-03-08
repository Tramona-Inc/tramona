import DashboardSidebar, {
  type NavLink,
} from "@/components/dashboard/DashboardSidebar";

const navLinks: NavLink[] = [
  { href: "/", name: "Oveview" },
  { href: "/my-trips", name: "My Trips" },
  { href: "/requests", name: "Request Offers" },
  { href: "/messages", name: "Messages" },
  { href: "/faq", name: "Faq" },
];

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="grid min-h-[calc(100vh-4.5rem)] grid-cols-1 lg:grid-cols-12">
        <DashboardSidebar navLinks={navLinks} />
        {children}
      </div>
    </>
  );
}
