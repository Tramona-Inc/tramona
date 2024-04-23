import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { EditIcon } from "lucide-react";

export default function HostPropertiesOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <EditIcon />
          <CardTitle>Properties</CardTitle>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/host/properties">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="@container">
        <div className="grid grid-cols-2 gap-4 @sm:grid-cols-3">
          <div className="col-span-2 rounded-lg border p-4 @sm:col-span-1">
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Listed
            </p>
            <p className="text-3xl font-bold">4</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Drafts
            </p>
            <p className="text-3xl font-bold">1</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Archived
            </p>
            <p className="text-3xl font-bold">2</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
