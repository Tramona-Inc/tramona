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
            "py-2 font-medium",
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

export default function DashboardSidebar({
  navLinks,
}: {
  navLinks: NavLink[];
}) {
  return (
    <div className="sticky top-0 col-span-2 hidden max-h-[100vh] flex-col justify-center gap-5 border-r-2 border-zinc-100 px-5 lg:flex 2xl:col-span-1">
      {navLinks.map((nav, index) => (
        <SidebarLink key={index} href={nav.href}>
          {nav.name}
        </SidebarLink>
      ))}
    </div>
  );
}
