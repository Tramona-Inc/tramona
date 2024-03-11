import DashboardSidebar, {
  type NavLink,
} from "@/components/dashboard/DashboardSidebar";
import Header from "../../Header";

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

export default function DashboadLayout({
  children,
  type,
}: DashboardLayoutProps) {
  return (
    <>
      <Header type={"dashboard"} />
      <div className="container grid flex-1 gap-12 lg:grid-cols-[125px_1fr]">
        <aside className="sticky hidden h-screen-minus-header w-[125px] flex-col lg:flex">
          <DashboardSidebar
            navLinks={type === "guest" ? GuestNavLinks : HostNavLinks}
          />
        </aside>
        <main className="flex min-h-screen-minus-small-header w-full flex-col overflow-hidden border-x sm:min-h-screen-minus-header">
          {children}
        </main>
      </div>
    </>
  );
}
