import TramonaIcon from "@/components/_icons/TramonaIcon";
import Link from "next/link";

export function TramonaLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-2xl font-bold 2xl:text-3xl"
    >
      <TramonaIcon />
      Tramona
    </Link>
  );
}
