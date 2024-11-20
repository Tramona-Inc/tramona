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
      noChildren={["/", "/admin", "/host"].includes(href)}
      render={({ selected }) => (
        <div
          className={cn(
            "relative flex flex-col items-center gap-1 px-1 py-2 text-center text-xs font-light",
            selected ? "text-primaryGreen" : "text-gray-500",
          )}
        >
          {/* @ts-expect-error ignore because of the strokeWidth, We might change it so i didnt refactor, idk. */}
          <Icon className="size-6 lg:size-8" strokeWidth={1.8} />
          {children}
        </div>
      )}
    />
  );
}
