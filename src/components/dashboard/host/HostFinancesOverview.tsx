import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export default function HostFinancesOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TagIcon />
          <CardTitle>Finances</CardTitle>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/host/finances">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end">
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Current balance
              </p>
              <p className="text-2xl font-bold">$385.50</p>
            </div>
            <Button className="w-24 rounded-full">Transfer</Button>
          </div>
          <div className="flex items-end">
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                Total
              </p>
              <p className="text-2xl font-bold">$2,416.80</p>
            </div>
            <Button variant="outline" className="w-24 rounded-full">
              View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
