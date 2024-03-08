import NavLink from "../_utils/NavLink";

import { cn } from "@/utils/utils";

function SidebarLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      href={href}
      render={({ selected }) => (
        <div
          className={cn(
            "py-2 font-medium hover:text-gray-200",
            selected ? "text-black" : "text-muted-foreground",
          )}
        >
          {children}
        </div>
      )}
    />
  );
}

export type NavLink = {
  href: string;
  name: string;
};

export default function HostDashboardSidebar({
  navLinks,
}: {
  navLinks: NavLink[];
}) {
  return (
    <div className="sticky top-0 flex flex-col justify-center gap-5 ">
      {navLinks.map((nav, index) => (
        <SidebarLink key={index} href={nav.href}>
          {nav.name}
        </SidebarLink>
      ))}
    </div>
  );
}
