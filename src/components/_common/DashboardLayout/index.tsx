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
    <div className="pt-header-sm sm:pt-header container grid h-screen flex-1 gap-12 lg:grid-cols-[125px_1fr]">
      <aside className="hidden w-[125px] flex-col lg:flex">
        <DashboardSidebar navLinks={navLinks} />
      </aside>
      <main className="flex h-full w-full flex-1 flex-col overflow-hidden border-x">
        {children}
      </main>
    </div>
  );
}
