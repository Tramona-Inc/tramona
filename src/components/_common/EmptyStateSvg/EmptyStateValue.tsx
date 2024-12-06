import { Button } from "@/components/ui/button";
import Link from "next/link";

type EmptyStateProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
} & (
  | { redirectTitle: string; href: string }
  | { redirectTitle?: undefined; href?: undefined }
);

export default function EmptyStateValue(props: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-32">
      {props.children}
      <div>
        {props.title && (
          <h2 className="text-center text-lg font-bold">{props.title}</h2>
        )}
        {props.description && (
          <p className="max-w-80 text-center font-medium text-muted-foreground">
            {props.description}
          </p>
        )}
      </div>
      {props.href && (
        <Button asChild>
          <Link href={props.href}>{props.redirectTitle}</Link>
        </Button>
      )}
    </div>
  );
}
