import { Button } from "@/components/ui/button";
import Link from "next/link";

type EmptyStateProps = {
  children?: React.ReactNode;
  title: string;
  description: string;
  redirectTitle: string;
  href: string;
};

export default function EmptyStateValue(props: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 pt-32">
      {props.children}

      <h2 className="text-center font-bold">{props.title}</h2>
      <p className="text-center font-medium">{props.description}</p>
      <Button className="px-8 font-bold" asChild>
        <Link href={props.href}>{props.redirectTitle}</Link>
      </Button>
    </div>
  );
}
