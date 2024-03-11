import DashboardSidebar, {
  type NavLink,
} from "@/components/dashboard/DashboardSidebar";

const HostNavLinks: NavLink[] = [
  { href: "/host", name: "Overview" },
  { href: "/messages", name: "Messages" },
];

const GuestNavLinks: NavLink[] = [
  { href: "/", name: "Oveview" },
  { href: "/my-trips", name: "My Trips" },
  { href: "/requests", name: "Request Offers" },
  { href: "/messages", name: "Messages" },
  { href: "/faq", name: "Faq" },
];

type DashboardLayoutProps = {
  children: React.ReactNode;
  type: "host" | "guest";
};

export default function DashboardLayout({
  children,
  type,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen-minus-small-header sm:min-h-screen-minus-header container grid flex-1 gap-12 lg:grid-cols-[125px_1fr]">
      <aside className="hidden w-[125px] flex-col lg:flex">
        <DashboardSidebar
          navLinks={type === "guest" ? GuestNavLinks : HostNavLinks}
        />
      </aside>
      <main className="flex w-full flex-col overflow-hidden border-x">
        {children}
      </main>
    </div>
  );
}
