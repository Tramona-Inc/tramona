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
    <div className="flex flex-col items-center gap-6 pt-32">
      {props.children}
      <div>
        <h2 className="text-center font-bold">{props.title}</h2>
        <p className="max-w-[350px] text-center font-medium">
          {props.description}
        </p>
      </div>
      <Button className="px-8 font-bold" asChild>
        <Link href={props.href}>{props.redirectTitle}</Link>
      </Button>
    </div>
  );
}
