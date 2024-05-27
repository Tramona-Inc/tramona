import { cn } from "@/utils/utils";
import NavLink from "../_utils/NavLink";

export function NavBarLink({
  href,
  children,
  icon: Icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.FC<{ className?: string }>;
}) {
  return (
    <NavLink
      href={href}
      render={({ selected }) => (
        <div
          className={cn(
            "relative flex flex-col items-center gap-1 py-3 text-center text-xs font-medium transition-all",
            selected ? "text-teal-700" : "text-muted-foreground",
          )}
        >
          <Icon className="size-6 lg:size-8" />
          {children}
        </div>
      )}
    />
  );
}
