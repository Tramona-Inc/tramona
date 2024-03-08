import { useRouter } from "next/router";
import Link from "next/link";
import type { ReactNode } from "react";

export default function NavLink({
  href,
  render,
}: {
  href: string;
  render: (props: { selected: boolean }) => ReactNode;
}) {
  const { asPath } = useRouter();
  const isCurrentPage = asPath.endsWith(href);

  return <Link href={href}>{render({ selected: isCurrentPage })}</Link>;
}
