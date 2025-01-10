import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

export default function NavLink({
  href,
  render,
  noChildren = false,
  onClick,
}: {
  href: string;
  render: (props: { selected: boolean }) => ReactNode;
  noChildren?: boolean;
  onClick?: () => void;
}) {
  const { asPath } = useRouter();

  const isCurrentPage = noChildren ? asPath === href : asPath.startsWith(href);

  return (
    <Link href={href} onClick={onClick}>
      {render({ selected: isCurrentPage })}
    </Link>
  );
}
