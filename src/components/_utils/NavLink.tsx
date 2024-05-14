import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export default function NavLink({
  href,
  render,
}: {
  href: string;
  render: (props: { selected: boolean }) => ReactNode;
}) {
  const { asPath } = useRouter();
  
  // Check if the current path matches the href exactly
  const isCurrentPage = asPath === href;

  return <Link href={href}>{render({ selected: isCurrentPage })}</Link>;
}
