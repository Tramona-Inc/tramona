import TramonaIcon from "@/components/_icons/TramonaIcon";
import { getHomePageFromRole } from "@/utils/formatters";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function TramonaLogo() {
  const session = useSession();
  const role = session.data?.user.role;
  const href = role ? getHomePageFromRole(role) : "/";

  return (
    <Link href={href} className="flex items-center gap-2 text-2xl font-bold">
      <TramonaIcon />
      Tramona
    </Link>
  );
}
