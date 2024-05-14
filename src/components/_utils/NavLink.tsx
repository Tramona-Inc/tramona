import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export default function NavLink({
  href,
  render,
  noChildren = false,
}: {
  href: string;
  render: (props: { selected: boolean }) => ReactNode;
  noChildren?: boolean;
}) {
  const { asPath } = useRouter();

  // Check if the current path matches the href exactly
  // const isCurrentPage = noChildren ? asPath === href : asPath.startsWith(href);
  const isCurrentPage = asPath === href;

  return <Link href={href}>{render({ selected: isCurrentPage })}</Link>;
}
