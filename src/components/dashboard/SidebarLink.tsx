import NavLink from "../_utils/NavLink";
import { cn } from "@/utils/utils";

export function SidebarLink({
  href,
  name,
  icon: Icon,
  noChildren,
}: {
  href: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  noChildren: boolean;
}) {
  return (
    <NavLink
      href={href}
      noChildren={noChildren}
      render={({ selected }) => (
        <div
          className={cn(
            "relative flex items-center gap-4 p-4 text-center font-medium lg:flex-col lg:gap-1 lg:px-2 lg:py-3 lg:text-xs",
            selected ? "text-blue-600" : "text-zinc-700",
          )}
        >
          <Icon className={cn("size-6 lg:size-8")} />

          {name}
        </div>
      )}
    />
  );
}
export type SidebarLinkProps = React.ComponentProps<typeof SidebarLink>;
