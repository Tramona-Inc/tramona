import NavLink from "../_utils/NavLink";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";

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
            selected
              ? "bg-zinc-200 text-black"
              : "text-zinc-700 hover:bg-zinc-200",
          )}
        >
          {selected && (
            <motion.div
              layoutId="sidebar-indicator"
              transition={{ duration: 0.1, ease: "circOut" }}
              className="absolute inset-y-0 right-0 border-[3px] border-transparent border-r-black"
            />
          )}

          <Icon
            className={cn(
              "size-6 lg:size-8",
              selected ? "text-black" : "text-zinc-700",
            )}
          />

          {name}
        </div>
      )}
    />
  );
}
export type SidebarLinkProps = React.ComponentProps<typeof SidebarLink>;
