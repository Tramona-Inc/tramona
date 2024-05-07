import { useRouter } from "next/router";
import Link from "next/link";
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
  const isCurrentPage = noChildren ? asPath === href : asPath.startsWith(href);
  return <Link href={href}>{render({ selected: isCurrentPage })}</Link>;
}
